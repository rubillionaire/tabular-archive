import fs from 'node:fs'
import fsp from 'node:fs/promises'
import b4a from 'b4a'
import { gzipSync, gunzipSync } from 'fflate'
import {
  encoder as enc,
  categories,
  maxEncoderTypeLength,
} from './encoder.mjs'
import { readCsvHeaderRow, readCsvDataRows } from './read-csv.mjs'
import { dataRowEncoder } from '../src/data-rows.mjs'
import {
  create as headerRowCreate,
  encode as headerRowEncode,
} from './header-row.mjs'
import {
  encode as categoriesEncoder,
} from './categories.mjs'
import {
  AwaitableWriteStream,
} from './stream-helpers.mjs'
import { userIdEncoderFn } from './user-supplied.mjs'


/**
 * Encode a tabular-archive from a CSV file
 * @param  {string} options.filePath      Path to CSV file
 * @param  {array?} options.userHeader    [{ field : string, encoder : string }]
 * @param  {function?} options.userIdForRow  ({ row }) => id | undefined
 * @param  {string} options.userIdEncoder encoder[userIdEncoder].{ encodingLength, encode, decode }
 * @return {object} results  { rowCount }
 */
export async function encode ({
  csvFilePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
}) {

  const tmpFileBase = `ta-intermediate-${ Date.now() }`

  const headerParts = [
      {
        name: 'headerRow',
      },
      {
        name: 'categories',
      },
      {
        name: 'dataRowIdEncoderString',
      },
      {
        name: 'dataRowLengths'
      },
      {
        name: 'dataRowIds',
      },
      {
        name: 'dataRows',
      },
    ].map((part) => {
      const tmpFilePath = `${ tmpFileBase }-${ part.name }`
      const writer = AwaitableWriteStream(tmpFilePath)
      return {
        ...part,
        tmpFilePath,
        writer,
      }
    })

  const headerPartsNamed = headerParts
    .map(part => {
      return {
        [part.name]: { ...part }
      }
    })
    .reduce((obj, curr) => {
      return {
        ...obj,
        ...curr,
      }
    }, {})

  const { header } = await readCsvHeaderRow({ filePath: csvFilePath })
  const { headerRow } = await headerRowCreate({ header, userHeader })

  const headerRowEncoded = await headerRowEncode({ headerRow })
  headerPartsNamed.headerRow.writer.write(headerRowEncoded.buffer)

  const rowEncoder = dataRowEncoder({ headerRow })
  
  const dataRowIdEncoder = userIdEncoderFn({ idEncoder: userIdEncoder })
  let dataRowIdEncoderString = 'string'.padEnd(maxEncoderTypeLength, ' ')
  if (typeof userIdEncoder === 'string') {
    dataRowIdEncoderString = userIdEncoder.padEnd(maxEncoderTypeLength, ' ')
  }
  const dataRowIdEncoderBuffer = b4a.alloc(
    enc.string.encodingLength(dataRowIdEncoderString)
  )
  enc.string.encode(dataRowIdEncoderString, dataRowIdEncoderBuffer, 0)
  headerPartsNamed.dataRowIdEncoderString.writer.write(dataRowIdEncoderBuffer)


  let rowCount = 0

  const onRow = ({ row }) => {
    rowCount += 1

    const { buffer } = rowEncoder.encode({ row })
    const compressedBuffer = gzipSync(buffer)
    headerPartsNamed.dataRows.writer.write(compressedBuffer)

    const encodedLengthBuffer = b4a.alloc(
      enc.int64.encodingLength(compressedBuffer.length)
    )
    enc.int64.encode(compressedBuffer.length, encodedLengthBuffer, 0)
    headerPartsNamed.dataRowLengths.writer.write(encodedLengthBuffer)

    if (typeof userIdForRow === 'function') {
      const id = userIdForRow({ row })
      const bufferLength = dataRowIdEncoder.encodingLength(id)
      let buffer = b4a.alloc(bufferLength)
      dataRowIdEncoder.encode(id, buffer, 0)
      headerPartsNamed.dataRowIds.writer.write(buffer)
    }
  }

  await readCsvDataRows({ filePath: csvFilePath, onRow })

  // categories are accumulated as each row is encoded
  const categoriesEncoded = categoriesEncoder({ categories })
  headerPartsNamed.categories.writer.write(categoriesEncoded.buffer)

  for (const part of headerParts) {
    await part.writer.end()
  }

  return { rowCount }
}
