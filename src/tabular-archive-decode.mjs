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

export async function ReadArchiveHeader ({ filePath }) {
  const emptyArchiveHeader = headerArchiveCreate()
  const start = 0
  const end = emptyArchiveHeader.buffer.length
  return ReadStartEnd({
    filePath,
    start,
    end,
  })
}

export async function ReadHeaderRow ({
    filePath,
    headerRowOffsetStart,
    headerRowOffsetEnd,
  }) {
  return ReadStartEnd({
    filePath,
    start: headerRowOffsetStart,
    end: headerRowOffsetEnd,
  })
}

export async function ReadCategories ({
    filePath,
    categoriesOffsetStart,
    categoriesOffsetEnd,
  }) {
  return ReadStartEnd({
    filePath,
    start: categoriesOffsetStart,
    end: categoriesOffsetEnd,
  })
}

export async function ReadDataRowIds ({
    filePath,
    dataRowIdsOffsetStart,
    dataRowIdsOffsetEnd,
  }) {
  return ReadStartEnd({
    filePath,
    start: dataRowIdsOffsetStart,
    end: dataRowIdsOffsetEnd,
  })
}

export async function ReadDataRowLengths ({
    filePath,
    dataRowLengthsOffsetStart,
    dataRowLengthsOffsetEnd,
  }) {
  return ReadStartEnd({
    filePath,
    start: dataRowLengthsOffsetStart,
    end: dataRowLengthsOffsetEnd,
  })
}

export const decode = async ({ archiveFilePath }) => {
  const archiveHeaderBuffer = await ReadArchiveHeader({
    filePath: archiveFilePath,
  })
  const archiveHeader = headerArchiveDecode({ buffer: archiveHeaderBuffer })
  const { dataRowIdsEncoderString } = archiveHeader
  // this is where the 
  const startOfDataRows = archiveHeader.dataRowLengthsOffsetEnd
  const userIdEncoder = enc[dataRowIdsEncoderString]

  const readOptions = {
    filePath: archiveFilePath,
    ...archiveHeader,
  }

  const headerRowBuffer = await ReadHeaderRow(readOptions)
  const { headerRow } = headerRowDecode({ buffer: headerRowBuffer })


  const categoriesBuffer = await ReadCategories(readOptions)
  const { categories } = categoriesDecode({ buffer: categoriesBuffer })
  setCategories(categories)

  const dataRowIdsBuffer = await ReadDataRowIds({
    filePath: archiveFilePath,
    ...archiveHeader,
  })
  const dataRowIds = decodeDataRowIdsBuffer({ buffer: dataRowIdsBuffer })

  const dataRowLengthsBuffer = await ReadDataRowLengths(readOptions)
  const dataRowLengths = decodeRowLengthsBuffer({ buffer: dataRowLengthsBuffer })

  const rowDecoder = dataRowDecoder({ headerRow })

  const rowCount = dataRowLengths.length

  return {
    rowCount,
    getRowBySequence,
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
}