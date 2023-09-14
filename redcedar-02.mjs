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
 */

import fs from 'node:fs'
import fsp from 'node:fs/promises'
import csv from 'csv-parser'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import enc from 'protocol-buffers-encodings'
import lps from 'length-prefixed-stream'
import b4a from 'b4a'

const categories = {}

enc.category = enc.make(7,
  function encode (field, val, buffer, offset) {
    if (!Array.isArray(categories[field])) categories[field] = []
    let valIndex = categories[field].indexOf(val)
    if (valIndex === -1) {
      categories[field].push(val)
      valIndex = categories[field].length - 1
    }
    enc.int32.encode(valIndex, buffer, offset)
    encode.bytes = enc.int32.encode.bytes
    return buffer
  },
  function decode (field, buffer, offset) {
    const valueIndex = enc.int32.decode(buffer.offset)
    decode.bytes = enc.int32.decode.bytes
    // will need to reconstruct the categories[fields] array
    // from a header
    const value = categories[field][valueIndex]
    return value
  },
  function encodingLength (field, val) {
    if (!Array.isArray(categories[field])) categories[field] = []
    let valIndex = categories[field].indexOf(val)
    if (valIndex === -1) {
      categories[field].push(val)
      valIndex = categories[field].length - 1
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
    if (spec.encoder.type === 7) return spec.encoder.encodingLength(spec.field, spec.value)
    else return spec.encoder.encodingLength(spec.value)
  }).reduce((acc, curr) => acc + curr, 0)

  return { bufferLength }
}

function encodeRow ({ row }) {
  const specs = header.map(fieldSpecs({ row }))
  const { bufferLength } = rowLength({ row })
  let buffer = b4a.alloc(bufferLength)
  let bufOffset = 0
  specs.forEach(spec => {
    if (spec.encoder.type === 7) spec.encoder.encode(spec.field, spec.value, buffer, bufOffset)
    else spec.encoder.encode(spec.value, buffer, bufOffset)
    bufOffset += spec.encoder.encode.bytes
  })
  return { buffer, bufferLength }
}

function decodeRow ({ buffer }) {
  const row = {}
  let offset = 0
  header.forEach(field => {
    const fieldSpec = userHeader.find(s => s.field === field)
    let encoder = enc.string
    if (fieldSpec?.encoding) {
      encoder = enc[fieldSpec.encoding]
    }
    let value
    if (encoder.type === 7) value = encoder.decode(field, buffer, offset)
    else value = encoder.decode(buffer, offset)
    row[field] = value
    offset += encoder.decode.bytes
  })
  return row
}

function TabularArchive () {
  const name = 'TabularArchive'
  const version = 1

  const headerRow = {
    buffer: undefined,
    offset: 0,
    bufferLength: 0,
  }
  const rowLengths = []

  function _getHeader () {
    let bufferLength = 0
    bufferLength += enc.string.encodingLength(name)
    bufferLength += enc.int32.encodingLength(version)
    // int32 = max 4 bytes
    // int64 = max 8 bytes
    // 4 - headerRowOffset
    // 4 - headerRowLength
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

  function addDataRowLength ({ row }) {
    const { bufferLength } = rowLength({ row })
    rowLengths.push(bufferLength)
  }

  function getHeader () {
    if (!headerRow.buffer) throw Error('Must store reference to the header row.')
    if (rowLengths.length === 0) throw Error('Must use addDataRowLength to produce header into row data.')

    const header = _getHeader()

    // value is the first byte after the header buffer length
    const headerRowOffetValue = header.buffer.length
    enc.int32.encode(headerRowOffetValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

    const headerRowLengthValue = headerRowOffetValue + headerRow.bufferLength
    enc.int32.encode(headerRowLengthValue, header.buffer, header.bufferLength)
    header.bufferLength += enc.int32.encode.bytes

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
    return {
      headerRowOffset,
      headerRowLength,
    }
  }

  function decodeHeaderRow ({ buffer }) {
    let offset = 0
    const headerRow = []
    while (offset < buffer.length) {
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

  function headerRange () {
    const { buffer } = _getHeader()
    return { start: 0, end: buffer.length }
  }

  return {
    addHeaderRow,
    addDataRowLength,
    getHeader,
    headerRange,
    decodeHeader,
    decodeHeaderRow,
  }
}

const readLengths = new Writable({
  objectMode: true,
  write: (row, enc, next) => {
    ta.addDataRowLength({ row })
    next()
  },
})

await pipeline(
  fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
  csvStream,
  readLengths
)

const headerRow = ta.addHeaderRow({ header, userHeader })
const taHeader = ta.getHeader()
const writer = fs.createWriteStream('encoded-header.lp')
writer.write(taHeader.buffer)
writer.write(headerRow.buffer)


writer.on('finish', async () => {
  const buf = await ReadEntireFile()
  const fileHeader = await ReadHeader()
  const headerRowBuffer = await ReadHeaderRow(fileHeader)
  const { headerRow } = ta.decodeHeaderRow({ buffer: headerRowBuffer })
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
        start: headerRowOffset,
        end: headerRowLength,
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
