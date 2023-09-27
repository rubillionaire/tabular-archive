import b4a from 'b4a'
import { gunzipSync } from 'fflate'
import {
  create as headerArchiveCreate,
  decode as headerArchiveDecode,
} from './archive-header.mjs'
import {
  decode as headerRowDecode,
} from './header-row.mjs'
import {
  decode as categoriesDecode,
} from './categories.mjs'
import {
  encoder as enc,
  setCategories,
} from './encoder.mjs'
import { dataRowDecoder } from './data-rows.mjs'

export const readArchiveRanges = ({ readRange }) => {
  return {
    archiveHeader: async ({ filePath }) => {
      const emptyArchiveHeader = headerArchiveCreate()
      const start = 0
      const end = emptyArchiveHeader.buffer.byteLength
      return readRange({
        filePath,
        start,
        end,
      })
    },
    headerRow: async ({ filePath, headerRowOffsetStart, headerRowOffsetEnd }) => {
      return readRange({
        filePath,
        start: headerRowOffsetStart,
        end: headerRowOffsetEnd,
      })
    },
    categories: async ({ filePath, categoriesOffsetStart, categoriesOffsetEnd }) => {
      return readRange({
        filePath,
        start: categoriesOffsetStart,
        end: categoriesOffsetEnd,
      })
    },
    dataRowIds: async ({ filePath, dataRowIdsOffsetStart, dataRowIdsOffsetEnd }) => {
      return readRange({
        filePath,
        start: dataRowIdsOffsetStart,
        end: dataRowIdsOffsetEnd,
      })
    },
    dataRowLengths: async ({ filePath, dataRowLengthsOffsetStart, dataRowLengthsOffsetEnd }) => {
      return readRange({
        filePath,
        start: dataRowLengthsOffsetStart,
        end: dataRowLengthsOffsetEnd,
      })
    },
    archiveHeaderPartsBuffer: async ({
        filePath,
        headerRowOffsetStart,
        headerRowOffsetEnd,
        categoriesOffsetStart,
        categoriesOffsetEnd,
        dataRowIdsOffsetStart,
        dataRowIdsOffsetEnd,
        dataRowLengthsOffsetStart,
        dataRowLengthsOffsetEnd,
      }) => {
      const ranges = [
        {
          name: 'headerRow',
          start: headerRowOffsetStart,
          end: headerRowOffsetEnd,
        },
        {
          name: 'categories',
          start: categoriesOffsetStart,
          end: categoriesOffsetEnd,
        },
        {
          name: 'dataRowIds',
          start: dataRowIdsOffsetStart,
          end: dataRowIdsOffsetEnd,
        },
        {
          name: 'dataRowLengths',
          start: dataRowLengthsOffsetStart,
          end: dataRowLengthsOffsetEnd,
        },
      ]

      const buffer = await readRange({
        filePath,
        ranges: [{ start: headerRowOffsetStart, end: dataRowLengthsOffsetEnd }],
      })

      let offset = 0
      const parts = {}
      for (const range of ranges) {
        const length = range.end - range.start
        const partBuffer = b4a.alloc(length)
        buffer.copy(partBuffer, 0, offset, offset + length)
        offset += length
        parts[`${range.name}Buffer`] = partBuffer
      }

      return parts
    },
  }
}

export const decode = ({ readRange }) => async ({ archiveFilePath }) => {

  const archiveRanges = readArchiveRanges({ readRange })

  const archiveHeaderBuffer = await archiveRanges.archiveHeader({
    filePath: archiveFilePath,
  })
  const archiveHeader = headerArchiveDecode({ buffer: archiveHeaderBuffer })
  // console.log({archiveHeader})

  const { dataRowIdsEncoderString } = archiveHeader
  // this is where the data starts
  const startOfDataRows = archiveHeader.dataRowLengthsOffsetEnd
  const userIdEncoder = enc[dataRowIdsEncoderString]

  const readOptions = {
    filePath: archiveFilePath,
    ...archiveHeader,
  }

  const {
    headerRowBuffer,
    categoriesBuffer,
    dataRowIdsBuffer,
    dataRowLengthsBuffer,
  } = await archiveRanges.archiveHeaderPartsBuffer(readOptions)

  const { headerRow } = headerRowDecode({ buffer: headerRowBuffer })

  const { categories } = categoriesDecode({ buffer: categoriesBuffer })
  setCategories(categories)

  const dataRowIdsDecoded = decodeDataRowIdsBuffer({ buffer: dataRowIdsBuffer })
  const { dataRowIds } = dataRowIdsDecoded

  const { dataRowLengths } = decodeRowLengthsBuffer({ buffer: dataRowLengthsBuffer })

  const rowDecoder = dataRowDecoder({ headerRow })

  const rowCount = dataRowLengths.length

  return {
    rowCount,
    categories,
    getRowBySequence,
    getRowsBySequence,
    getRowById,
    getRowsByIdWithPage,
  }

  function decodeDataRowIdsBuffer ({ buffer, offset=0 }) {
    const dataRowIds = []
    while (offset < buffer.length - 1) {
      const id = userIdEncoder.decode(buffer, offset)
      offset += userIdEncoder.decode.bytes
      dataRowIds.push(id)
    }
    return { dataRowIds, offset }
  }

  function decodeRowLengthsBuffer ({ buffer, offset=0 }) {
    const dataRowLengths = []
    while (offset < buffer.length - 1) {
      const len = enc.int64.decode(buffer, offset)
      offset += enc.int64.decode.bytes
      dataRowLengths.push(len)
    }
    return { dataRowLengths, offset }
  }

  function sum (accumulator, current) {
    return accumulator + current
  }

  async function getRowBySequence ({ rowNumber }) {
    const start = dataRowLengths.slice(0, rowNumber).reduce(sum, startOfDataRows)
    const end = dataRowLengths.slice(rowNumber, rowNumber + 1).reduce(sum, start)
    const compressedBuffer = await readRange({
      filePath: archiveFilePath,
      start,
      end,
    })
    const buffer = gunzipSync(compressedBuffer)
    const { row } = rowDecoder({ buffer })
    return { row }
  }

  async function* getRowsBySequence ({ startRowNumber, endRowNumber }) {
    const start = dataRowLengths.slice(0, startRowNumber).reduce(sum, startOfDataRows)
    const rowLengths = dataRowLengths.slice(startRowNumber, endRowNumber + 1)
    const end = rowLengths.reduce(sum, start)
    const compressedBuffer = await readRange({
      filePath: archiveFilePath,
      start,
      end,
    })
    let offsetStart = 0
    for (let i = 0; i < rowLengths.length; i++) {
      const offsetEnd = offsetStart + rowLengths[i]
      const compressedBufferSlice = b4a.alloc(rowLengths[i])
      compressedBuffer.copy(compressedBufferSlice, 0, offsetStart, offsetEnd)
      const buffer = gunzipSync(compressedBufferSlice)
      const { row } = rowDecoder({ buffer })
      yield { row }
      offsetStart = offsetEnd
    }
  }

  async function getRowById ({ id }) {
    const index = dataRowIds.indexOf(id)
    if (index === -1) throw new Error(`No id value ${id} in this archive`)
    return await getRowBySequence({ rowNumber: index })
  }

  function getRowsByIdWithPage ({ id, pageCount }) {
    const index = dataRowIds.indexOf(id)
    if (index === -1) throw new Error(`No id value ${id} in this archive`)
    const rowOffset = (pageCount-1)/2
    let startRowNumber = index -  Math.floor(rowOffset)
    let endRowNumber = index + Math.ceil(rowOffset)
    if (startRowNumber < 0) {
      const diff = 0 - startRowNumber
      startRowNumber = 0
      endRowNumber += diff
    }
    else if (endRowNumber > dataRowIds.length - 1) {
      const diff = endRowNumber - (dataRowIds.length - 1)
      startRowNumber -= diff
      endRowNumber -= diff
    }
    return getRowsBySequence({ startRowNumber, endRowNumber })
  }
}