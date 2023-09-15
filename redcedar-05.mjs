/*
- redcedar-00
- adds `cateogry` & `geo` encodings, can roudtrip data
- does not include a header, so this roudtrip can only be done in process
- recedar-01
- first take at a header, includes name and version, and where header data 
   starts and ends
- recedar-02
- writing out header data and reading it in. we can read out
the headerRow from the file. lets read out categories
- recedar-03
- encode write read categories
- recedar-04
- encode write read data rows
- redcedar-05
- allow for defining a indexable row value
 */

import assert from 'node:assert'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import csv from 'csv-parser'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import enc from 'protocol-buffers-encodings'
import lps from 'length-prefixed-stream'
import b4a from 'b4a'

function sum (arr) {
  return arr.reduce((a,c) => a +c , 0)
}

const categories = []

enc.category = enc.make(7,
  function encode (val, buffer, offset) {
    let valIndex = categories.indexOf(val)
    if (valIndex === -1) {
      categories.push(val)
      valIndex = categories.length - 1
    }
    enc.int32.encode(valIndex, buffer, offset)
    encode.bytes = enc.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const valueIndex = enc.int32.decode(buffer.offset)
    decode.bytes = enc.int32.decode.bytes
    // will need to reconstruct the categories[fields] array
    // from a header
    const value = categories[valueIndex]
    return value
  },
  function encodingLength (val) {
    let valIndex = categories.indexOf(val)
    if (valIndex === -1) {
      categories.push(val)
      valIndex = categories.length - 1
    }
    return enc.int32.encodingLength(valIndex)
  }
)

enc.geo = enc.make(6,
  function encode (val, buffer, offset) {
    const value = Math.floor(val * 10_000_000)
    enc.int32.encode(value, buffer, offset)
    encode.bytes = enc.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const val = enc.int32.decode(buffer, offset)
    decode.bytes = enc.int32.decode.bytes
    return val / 10_000_000
  },
  function encodingLength (val) {
    return enc.int32.encodingLength(Math.floor(val * 10_000_000))
  }
)

// this is used to create space for the user supplied
// `idEncoder`, which will get padded for at this length
// to make the header size consistently the same size
const maxEncoderTypeLength = Object.keys(enc)
  .map(encoder => encoder.length)
  .sort()
  .pop()

const csvStream = csv()

const analyses = [
  'period-all',
  'period-eph',
  'period-int',
  'period-min-eph',
  'period-min-int',
  'period-per',
  'period-unk',
]

const analysesHeaders = analyses.map(name => {
  return [
    {
      field: `${name}-dist`,
      encoder: 'float',
    },
    {
      field: `${name}-nfeat-period`,
      encoder: 'category',
    },
  ]
}).reduce((acc, curr) => acc.concat(curr), [])

const userHeader = [
  {
    field: '',
    encoder: 'int32',
  },
  {
    field: 'id',
    encoder: 'int32',
  },
  {
    field: 'latitude',
    encoder: 'geo'
  },
  {
    field: 'longitude',
    encoder: 'geo'
  },
  {
    field: 'reclassified.tree.canopy.symptoms',
    encoder: 'category',
  },
].concat(analysesHeaders)

const userIdForRow = ({ row }) => {
  return parseInt(row.id)
}

const userIdEncoder = 'int32'

function userIdEncoderFn () {
  let encoder = enc.string
  if (typeof userIdEncoder === 'string') {
    encoder = enc[userIdEncoder]
  }
  return encoder
}

const ta = TabularArchive()

let header
csvStream.on('headers', (_header) => {
  header = _header
})

const fieldSpecs = ({ row }) => (field) => {
  const fieldSpec = userHeader.find(s => s.field === field)
  let encoder = enc.string
  if (fieldSpec?.encoder) {
    encoder = enc[fieldSpec.encoder]
  }
  if (!encoder) throw new Error(`Could not find encoder for field ${field}`)
  return {
    encoder,
    value: row[field],
    field,
  }
}

function rowLength ({ row }) {
  const specs = header.map(fieldSpecs({ row }))
  const bufferLength = specs.map(spec => {
    return spec.encoder.encodingLength(spec.value)
  }).reduce((acc, curr) => acc + curr, 0)

  return { bufferLength }
}

function encodeRow ({ row }) {
  const specs = header.map(fieldSpecs({ row }))
  const { bufferLength } = rowLength({ row })
  let buffer = b4a.alloc(bufferLength)
  let bufOffset = 0
  specs.forEach(spec => {
    spec.encoder.encode(spec.value, buffer, bufOffset)
    bufOffset += spec.encoder.encode.bytes
  })
  assert.equal(bufferLength, bufOffset)
  return { buffer, bufferLength }
}

function decodeRow ({ headerRow, buffer, offset=0 }) {
  const row = {}
  headerRow.forEach(headerSpec => {
    const encoder = enc[headerSpec.encoder]
    const value = encoder.decode(buffer, offset)
    offset += encoder.decode.bytes
    row[headerSpec.field] = value
  })
  return {
    row,
    buffer,
    offset,
  }
}

function TabularArchive () {
  const name = 'TabularArchive'
  const version = 1

  const headerRow = {
    buffer: undefined,
    bufferLength: 0,
  }
  // array of bufferLengths, one for each row represented in the archive
  const rowLengths = []
  // array of encoded id values, one for each row represented in the archive
  const rowIds = []

  /**
   * return a partially filled buffer with the space allocated
   * for all parts of the header. the `buffer` returned has
   * the entire space alotment, bufferLength only has the
   * two fixed pieces already inserted (`name` and `version`).
   */
  function _getHeader () {
    let bufferLength = 0
    bufferLength += enc.string.encodingLength(name)
    bufferLength += enc.int32.encodingLength(version)
    // int32 = max 4 bytes
    // int64 = max 8 bytes
    
    // 4 - headerRowOffset
    // 4 - headerRowLength
    bufferLength += (4 + 4)

    // 4 - categoryOffset
    // 4 - categoryLength
    bufferLength += (4 + 4)
    
    // string - dataRowIdEncoderType
    bufferLength += enc.string.encodingLength('string'.padEnd(maxEncoderTypeLength, ' '))
    // 4 - dataRowIdOffset
    // 4 - dataRowIdLength
    bufferLength += (4 + 4)
    
    // 8 - dataRowOffset
    // 8 - dataRowLength
    bufferLength += (8 + 8)
    
    let buffer = b4a.alloc(bufferLength)
    bufferLength = 0
    
    enc.string.encode(name, buffer, bufferLength)
    bufferLength += enc.string.encode.bytes
    enc.int32.encode(version, buffer, bufferLength)
    bufferLength += enc.int32.encode.bytes
    
    return { buffer, bufferLength }
  }

  /**
   * Given `header`, a complete `csv-parser` header row object,
   * and a `userHeader` that further defines field level value
   * encoders, return a complete `headerRow` array
   *
   * headerRow : [{ field : string, encoder : string }]
   *
   * The return value is this `headerRow` array stored
   * in a buffer that can be decoded using the `bufferLength`
   */
  function addHeaderRow ({ header, userHeader }) {
    const specs = header.map(field => {
      const userSpec = userHeader.find(s => s.field === field)
      let encoder = 'string'
      if (userSpec?.encoder) {
        encoder = userSpec.encoder
      }
      return {
        field,
        encoder,
      }
    })

    const bufferLength = specs.map(s => {
      return enc.string.encodingLength(s.field) +
        enc.string.encodingLength(s.encoder) 
    }).reduce((a, c) => a + c, 0)

    const buffer = b4a.alloc(bufferLength)
    let offset = 0
    specs.forEach(s => {
      enc.string.encode(s.field, buffer, offset)
      offset += enc.string.encode.bytes
      enc.string.encode(s.encoder, buffer, offset)
      offset += enc.string.encode.bytes
    })

    headerRow.buffer = buffer
    headerRow.bufferLength = bufferLength

    return headerRow
  }

  /**
   * Stream all row values here and save relevant
   * information stored
   */
  function addDataRow ({ row }) {
    const { bufferLength } = rowLength({ row })
    rowLengths.push(bufferLength)
    if (typeof userIdForRow === 'function') {
      const encoder = userIdEncoderFn()
      const id = userIdForRow({ row })
      const bufferLength = encoder.encodingLength(id)
      rowIds.push(bufferLength)
    }
  }

  function getCategories () {
    let bufferLength = categories.map(s => {
      return enc.string.encodingLength(s)
    }).reduce((a, c) => a + c, 0)
    let buffer = b4a.alloc(bufferLength)
    bufferLength = 0
    categories.forEach(s => {
      enc.string.encode(s, buffer, bufferLength)
      bufferLength += enc.string.encode.bytes
    })

    return { buffer, bufferLength }
  }

  function _getDataRowIdLength () {
    const bufferLength = rowIds.reduce((a, c) => a + c, 0)
    return { bufferLength }
  }

  function _getDataRowLength () {
    const bufferLength = rowLengths.map((rowLength, index) => {
      return enc.int64.encodingLength(rowLength)
    }).reduce((a, c) => a + c, 0)
    return { bufferLength }
  }

  function getDataRowLenths () {
    let { bufferLength } = _getDataRowLength()
    const buffer = b4a.alloc(bufferLength)
    bufferLength = 0
    rowLengths.forEach((rowLength) => {
      enc.int64.encode(rowLength, buffer, bufferLength)
      bufferLength += enc.int64.encode.bytes
    })

    return { buffer, bufferLength}
  }

  function getHeader () {
    if (!headerRow.buffer) throw Error('Must store reference to the header row using `addHeaderRow`.')
    if (rowLengths.length === 0) throw Error('Must use `addDataRow` to produce header into row data.')

    const header = _getHeader()
    const headerCategories = getCategories()

    // value is the first byte after the header buffer length
    const headerRowOffetValue = header.buffer.length
    enc.int32.encode(headerRowOffetValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const headerRowLengthValue = headerRowOffetValue + headerRow.bufferLength
    enc.int32.encode(headerRowLengthValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const headerCategoryOffsetValue = headerRowLengthValue
    enc.int32.encode(headerCategoryOffsetValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const headerCategoryLenghtValue = headerCategoryOffsetValue + headerCategories.bufferLength
    enc.int32.encode(headerCategoryLenghtValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    let dataRowIdEncoderString = 'string'.padEnd(maxEncoderTypeLength, ' ')
    if (typeof userIdEncoder === 'string') {
      dataRowIdEncoderString = userIdEncoder.padEnd(maxEncoderTypeLength, ' ')
    }
    enc.string.encode(dataRowIdEncoderString, header.buffer, header.bufferLength)
    header.bufferLength += enc.string.encode.bytes

    const dataRowIdOffsetValue = headerCategoryLenghtValue
    enc.int32.encode(dataRowIdOffsetValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const dataRowIdLength = _getDataRowIdLength()
    const dataRowIdLengthValue = dataRowIdOffsetValue + dataRowIdLength.bufferLength
    enc.int32.encode(dataRowIdLengthValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const dataRowOffsetValue = dataRowIdLengthValue
    enc.int64.encode(dataRowOffsetValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int64.encode.bytes

    const dataRowLength = _getDataRowLength()    
    const dataRowLengthValue = dataRowOffsetValue + dataRowLength.bufferLength
    enc.int64.encode(dataRowLengthValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int64.encode.bytes

    return { ...header }
  }

  function decodeHeader ({ buffer }) {
    let offset = 0
    const hName = enc.string.decode(buffer, offset)
    offset += enc.string.decode.bytes
    const hVersion = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    if (name !== hName || version !== hVersion) throw Error('oops')
    
    const headerRowOffset = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const headerRowLength = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    
    const categoryOffset = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const categoryLength = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes

    const dataRowIdEncoder = enc.string.decode(buffer, offset).trim()
    offset += enc.string.decode.bytes
    const dataRowIdOffset = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const dataRowIdLength = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    
    const dataRowOffset = enc.int64.decode(buffer, offset)
    offset += enc.int64.decode.bytes
    const dataRowLength = enc.int64.decode(buffer, offset)
    offset += enc.int64.decode.bytes
    
    // data row buffers written starting at dataRowLength
    return {
      headerRowOffset,
      headerRowLength,
      categoryOffset,
      categoryLength,
      dataRowIdEncoder,
      dataRowIdOffset,
      dataRowIdLength,
      dataRowOffset,
      dataRowLength,
    }
  }

  function decodeHeaderRow ({ buffer }) {
    let offset = 0
    const headerRow = []
    while (offset <  buffer.length - 1) {
      const field = enc.string.decode(buffer, offset)
      offset += enc.string.decode.bytes
      const encoder = enc.string.decode(buffer, offset)
      offset += enc.string.decode.bytes
      headerRow.push({
        field,
        encoder,
      })
    }
    return { headerRow }
  }

  function decodeCategory ({ buffer }) {
    let offset = 0
    const categories = []
    while (offset < buffer.length - 1) {
      const category = enc.string.decode(buffer, offset)
      offset += enc.string.decode.bytes
      categories.push(category)
    }
    return { categories }
  }

  function decodeRowId ({ encoder, buffer }) {
    if (buffer.length === 0) return { rowIds: [] }

    let offset = 0
    const rowIds = []
    while (offset < buffer.length - 1) {
      const rowId = encoder.decode(buffer, offset)
      offset += encoder.decode.bytes
      // console.log({rowId})
      rowIds.push(rowId)
    }

    return { rowIds }
  }

  function decodeDataRowLengths ({ buffer }) {
    let offset = 0
    const rowLengths = []
    while (offset < buffer.length -1) {
      const rowLength = enc.int64.decode(buffer, offset)
      offset += enc.int64.decode.bytes
      rowLengths.push(rowLength)
    }
    return { rowLengths }
  }

  function headerRange () {
    const { buffer } = _getHeader()
    return { start: 0, end: buffer.length }
  }

  function dataRowBufferRangeQuery ({ fileHeader, rowLengths }) {
    return ({ start, end }) => {
      // data starts at the end of the data row entries
      let dataStart = fileHeader.dataRowLength
      let count = 0
      if (start > 0) {
        for (let i = 0; i < start; i++) {
          dataStart += rowLengths[i]
        }
      }
      let dataEnd = dataStart
      for (let i = start; i < end; i++) {
        count += 1
        dataEnd += rowLengths[i]
      }
      return {
        start: dataStart,
        end: dataEnd,
        count,
      }
    }
  }
  
  return {
    addHeaderRow,
    addDataRow,
    getHeader,
    getCategories,
    getDataRowLenths,
    headerRange,
    decodeHeader,
    decodeHeaderRow,
    decodeCategory,
    decodeRowId,
    decodeDataRowLengths,
    dataRowBufferRangeQuery,
  }
}

const readLengths = new Writable({
  objectMode: true,
  write: (row, enc, next) => {
    ta.addDataRow({ row })
    next()
  },
})

await pipeline(
  fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
  csvStream,
  readLengths
)

const writer = fs.createWriteStream('encoded-header.lp')
const headerRow = ta.addHeaderRow({ header, userHeader })
const taHeader = ta.getHeader()
writer.write(taHeader.buffer)
writer.write(headerRow.buffer)
const taCategories = ta.getCategories()
writer.write(taCategories.buffer)

if (typeof userIdForRow == 'function') {
  const encoder = userIdEncoderFn()
  const readDataRowId = new Writable({
    objectMode: true,
    write: (row, enc, next) => {
      const id = userIdForRow({ row })
      const bufferLength = encoder.encodingLength(id)
      let buffer = b4a.alloc(bufferLength)
      encoder.encode(id, buffer, 0)
      writer.write(buffer)
      next()
    },
  })

  await pipeline(
    fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
    csv(),
    readDataRowId
  )
}

const dataRowLengths = ta.getDataRowLenths()
const { rowLengths } = ta.decodeDataRowLengths(dataRowLengths)
writer.write(dataRowLengths.buffer)

const readDataRow = new Writable({
  objectMode: true,
  write: (row, enc, next) => {
    const { buffer } = encodeRow({ row })
    writer.write(buffer)
    next()
  },
})

await pipeline(
  fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
  csv(),
  readDataRow
)

writer.on('finish', async () => {
  const buf = await ReadEntireFile()
  const fileHeader = await ReadHeader()
  console.log({ fileHeader })
  
  const headerRowBuffer = await ReadHeaderRow(fileHeader)
  const { headerRow } = ta.decodeHeaderRow({ buffer: headerRowBuffer })
  
  const categoryBuffer = await ReadCategory(fileHeader)
  const { categories } = ta.decodeCategory({ buffer: categoryBuffer })
  
  const dataRowIdBuffer = await ReadDataRowId(fileHeader)
  const { rowIds } = ta.decodeRowId({
    buffer: dataRowIdBuffer,
    encoder: enc[fileHeader.dataRowIdEncoder]
  })

  const dataRowOffsetsBuffer = await ReadDataRowLengths(fileHeader)
  const { rowLengths } = ta.decodeDataRowLengths({ buffer: dataRowOffsetsBuffer })
  const dataRowBufferRangeFinder = ta.dataRowBufferRangeQuery({ fileHeader, rowLengths })
  
  // range query
  {
    const range = dataRowBufferRangeFinder({ start: 0, end: 1 })
    const dataRowBuffer = await ReadStartEnd(range)
    let offset = 0
    for (let i = 0; i < range.count; i++) {
      const result = decodeRow({ headerRow, buffer: dataRowBuffer, offset })
      offset += result.offset
      // console.log({row: result.row})
    }
  }

  // id query
  {
    // TODO perhaps this should store only the dataRowIdBuffer, and decode
    // the buffer, and find our value at the same time
    const rowIndex = rowIds.indexOf(145779813)
    const range = dataRowBufferRangeFinder({ start: rowIndex, end: rowIndex + 1 })
    const dataRowBuffer = await ReadStartEnd(range)
    let offset = 0
    for (let i = 0; i < range.count; i++) {
      const result = decodeRow({ headerRow, buffer: dataRowBuffer, offset })
      offset += result.offset
      // console.log({row: result.row})
    }
  }
})

writer.end()

async function ReadHeader () {
  return new Promise(async (resolve, reject) => {
    const readHeader = new Writable({
      write: (buffer, enc, next) => {
        const decodedHeader = ta.decodeHeader({ buffer })
        resolve(decodedHeader)
        next()
      }
    })

    await pipeline(
      fs.createReadStream('encoded-header.lp', ta.headerRange()),
      readHeader)
  })
}

async function ReadHeaderRow ({
    headerRowOffset,
    headerRowLength,
  }) {
  return ReadStartEnd({
    start: headerRowOffset,
    end: headerRowLength,
  })
}

async function ReadCategory ({
    categoryOffset,
    categoryLength,
  }) {
  return ReadStartEnd({
    start: categoryOffset,
    end: categoryLength,
  })
}

async function ReadDataRowId ({
    dataRowIdOffset,
    dataRowIdLength,
  }) {
  return ReadStartEnd({
    start: dataRowIdOffset,
    end: dataRowIdLength,
  })
}

async function ReadDataRowLengths ({
    dataRowOffset,
    dataRowLength,
  }) {
  console.log({ dataRowOffset, dataRowLength })
  return ReadStartEnd({
    start: dataRowOffset,
    end: dataRowLength,
  })
}

async function ReadStartEnd ({ start, end }) {
  let completeBuffer
  return new Promise(async (resolve, reject) => {
    const readHeader = new Writable({
      write: (buffer, enc, next) => {
        if (completeBuffer)  {
          const len = completeBuffer.length + buffer.length
          completeBuffer = Buffer.concat([completeBuffer, buffer], len)
        }
        else {
          completeBuffer = buffer
        }
        next()
      },
    })

    await pipeline(
      fs.createReadStream('encoded-header.lp', {
        start,
        end,
      }),
      readHeader)

    resolve(completeBuffer)
  })
}

async function ReadEntireFile () {
  let completeBuffer
  return new Promise(async (resolve, reject) => {
    const readHeader = new Writable({
      write: (buffer, enc, next) => {
        if (completeBuffer)  {
          const len = completeBuffer.length + buffer.length
          completeBuffer = Buffer.concat([completeBuffer, buffer], len)
        }
        else {
          completeBuffer = buffer
        }
        next()
      },
    })

    await pipeline(
      fs.createReadStream('encoded-header.lp'),
      readHeader)

    resolve(completeBuffer)
  })
}