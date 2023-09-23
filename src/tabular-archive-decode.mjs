import b4a from 'b4a'
import { gunzipSync } from 'fflate'
import {
  create as headerArchiveCreate,
  decode as headerArchiveDecode,
} from './archive-header.mjs'
import {
  ReadStartEnd,
} from './stream-helpers.mjs'
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
  }
}

export const decode = async ({ archiveFilePath, readRange }) => {

  const archiveRanges = readArchiveRanges({ readRange })

  const archiveHeaderBuffer = await archiveRanges.archiveHeader({
    filePath: archiveFilePath,
  })
  const archiveHeader = headerArchiveDecode({ buffer: archiveHeaderBuffer })
  const { dataRowIdsEncoderString } = archiveHeader
  // this is where the data starts
  const startOfDataRows = archiveHeader.dataRowLengthsOffsetEnd
  const userIdEncoder = enc[dataRowIdsEncoderString]

  const readOptions = {
    filePath: archiveFilePath,
    ...archiveHeader,
  }

  const headerRowBuffer = await archiveRanges.headerRow(readOptions)
  const { headerRow } = headerRowDecode({ buffer: headerRowBuffer })


  const categoriesBuffer = await archiveRanges.categories(readOptions)
  const { categories } = categoriesDecode({ buffer: categoriesBuffer })
  setCategories(categories)

  const dataRowIdsBuffer = await archiveRanges.dataRowIds({
    filePath: archiveFilePath,
    ...archiveHeader,
  })
  const dataRowIds = decodeDataRowIdsBuffer({ buffer: dataRowIdsBuffer })

  const dataRowLengthsBuffer = await archiveRanges.dataRowLengths(readOptions)
  const dataRowLengths = decodeRowLengthsBuffer({ buffer: dataRowLengthsBuffer })

  const rowDecoder = dataRowDecoder({ headerRow })

  const rowCount = dataRowLengths.length

  return {
    rowCount,
    categories,
    getRowBySequence,
    getRowById,
  }

  function decodeDataRowIdsBuffer ({ buffer, offset=0 }) {
    const ids = []
    while (offset < buffer.length - 1) {
      const id = userIdEncoder.decode(buffer, offset)
      offset += userIdEncoder.decode.bytes
      ids.push(id)
    }
    return ids
  }

  function decodeRowLengthsBuffer ({ buffer, offset=0 }) {
    const lengths = []
    while (offset < buffer.length - 1) {
      const len = enc.int64.decode(buffer, offset)
      offset += enc.int64.decode.bytes
      lengths.push(len)
    }
    return lengths
  }

  function sum (accumulator, current) {
    return accumulator + current
  }

  async function getRowBySequence ({ rowNumber }) {
    const start = dataRowLengths.slice(0, rowNumber).reduce(sum, startOfDataRows)
    const end = start + dataRowLengths.slice(rowNumber, rowNumber + 1)[0]
    const compressedBuffer = await ReadStartEnd({
      filePath: archiveFilePath,
      start,
      end,
    })
    const buffer = gunzipSync(compressedBuffer)
    const { row } = rowDecoder({ buffer })
    return { row }
  }

  async function getRowById ({ id }) {
    const index = dataRowIds.indexOf(id)
    if (index === -1) throw new Error(`No id value ${id} in this archive`)
    return await getRowBySequence({ rowNumber: index })
  }
}