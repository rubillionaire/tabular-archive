import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import b4a from 'b4a'
import { gzipSync } from 'fflate'
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
import {
  create as headerArchiveCreate,
} from './archive-header.mjs'
import { userIdEncoderFn } from './user-supplied.mjs'


/**
 * Encode a tabular-archive from a CSV file
 * 
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
  archiveFilePath,
}) {

  const tmpFileBase = `${ archiveFilePath }-${ Date.now() }`

  const archiveParts = [
      {
        name: 'headerRow',
        archiveHeaderInsert: async ({ archiveHeader, tmpFilePath }) => {
          const { size } = await fsp.stat(tmpFilePath)

          enc.int32.encode(archiveHeader.fileHead, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          const end = archiveHeader.fileHead + size
          enc.int32.encode(end, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          archiveHeader.fileHead = end
        },
      },
      {
        name: 'categories',
        archiveHeaderInsert: async ({ archiveHeader, tmpFilePath }) => {
          const { size } = await fsp.stat(tmpFilePath)

          enc.int32.encode(archiveHeader.fileHead, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          const end = archiveHeader.fileHead + size
          enc.int32.encode(end, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          archiveHeader.fileHead = end
        },
      },
      {
        name: 'dataRowIdEncoderString',
        doNotInlineInArchive: true,
        archiveHeaderInsert: async ({ archiveHeader }) => {
          // we only write the string to the header, we don't bump the fileHead
          // but we do bump our position in the archiveHeader.bufferLength
          const dataRowIdEncoderString = getDataRowIdEncoderString({ userIdEncoder })

          enc.string.encode(dataRowIdEncoderString, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.string.encode.bytes
        },
      },
      {
        name: 'dataRowIds',
        archiveHeaderInsert: async ({ archiveHeader, tmpFilePath }) => {
          const { size } = await fsp.stat(tmpFilePath)

          enc.int32.encode(archiveHeader.fileHead, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          const end = archiveHeader.fileHead + size
          enc.int32.encode(end, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int32.encode.bytes

          archiveHeader.fileHead = end
        },
      },
      {
        name: 'dataRowLengths',
        archiveHeaderInsert: async ({ archiveHeader, tmpFilePath }) => {
          const { size } = await fsp.stat(tmpFilePath)

          enc.int64.encode(archiveHeader.fileHead, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int64.encode.bytes

          const end = archiveHeader.fileHead + size
          enc.int64.encode(end, archiveHeader.buffer, archiveHeader.bufferLength)
          archiveHeader.bufferLength += enc.int64.encode.bytes

          archiveHeader.fileHead = end
        }
      },
      {
        name: 'dataRows',
        archiveHeaderInsert: async () => {
          // our data rows sit at the archiveHeader.fileHead
          // through the end of the file
        },
      },
    ].map((part) => {
      const tmpFilePath = `${ tmpFileBase }-${ part.name }`
      const tmpFile = AwaitableWriteStream(tmpFilePath)
      return {
        ...part,
        tmpFilePath,
        tmpFile,
      }
    })

  const archivePartsNamed = archiveParts
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

  // create data in `tmpFile`
  const { header } = await readCsvHeaderRow({ filePath: csvFilePath })
  const { headerRow } = await headerRowCreate({ header, userHeader })

  const headerRowEncoded = await headerRowEncode({ headerRow })
  archivePartsNamed.headerRow.tmpFile.write(headerRowEncoded.buffer)

  const rowEncoder = dataRowEncoder({ headerRow })
  
  const dataRowIdEncoder = userIdEncoderFn({ idEncoder: userIdEncoder })
  const dataRowIdEncoderString = getDataRowIdEncoderString({ userIdEncoder })
  const dataRowIdEncoderBuffer = b4a.alloc(
    enc.string.encodingLength(dataRowIdEncoderString)
  )
  enc.string.encode(dataRowIdEncoderString, dataRowIdEncoderBuffer, 0)
  archivePartsNamed.dataRowIdEncoderString.tmpFile.write(dataRowIdEncoderBuffer)
  
  const onRow = ({ row }) => {
    const { buffer } = rowEncoder.encode({ row })
    const compressedBuffer = gzipSync(buffer)
    archivePartsNamed.dataRows.tmpFile.write(compressedBuffer)

    const encodedLengthBuffer = b4a.alloc(
      enc.int64.encodingLength(compressedBuffer.length)
    )
    enc.int64.encode(compressedBuffer.length, encodedLengthBuffer, 0)
    archivePartsNamed.dataRowLengths.tmpFile.write(encodedLengthBuffer)

    if (typeof userIdForRow === 'function') {
      const id = userIdForRow({ row })
      
      const bufferLength = dataRowIdEncoder.encodingLength(id)
      let buffer = b4a.alloc(bufferLength)
      dataRowIdEncoder.encode(id, buffer, 0)
      archivePartsNamed.dataRowIds.tmpFile.write(buffer)
    }
  }

  const { rowCount } = await readCsvDataRows({ filePath: csvFilePath, onRow })

  // categories are accumulated as each row is encoded
  const categoriesEncoded = categoriesEncoder({ categories })
  archivePartsNamed.categories.tmpFile.write(categoriesEncoded.buffer)

  for (const part of archiveParts) {
    await part.tmpFile.end()
  }

  // assemble the header
  const archiveHeader = headerArchiveCreate()
  for (const part of archiveParts) {
    await part.archiveHeaderInsert({ ...part, archiveHeader })
  }

  // write out the final file
  const archive = AwaitableWriteStream(archiveFilePath)
  archive.write(archiveHeader.buffer)
  const concatStream = () => {
    return new Writable({
      write: (buffer, enc, next) => {
        archive.write(buffer)
        next()
      },
    })
  }
  for (const part of archiveParts) {
    if (part.doNotInlineInArchive === true) continue
    await pipeline(
      fs.createReadStream(part.tmpFilePath),
      concatStream())
  }

  // clean up tmp files
  for (const part of archiveParts) {
    await fsp.unlink(part.tmpFilePath)
  }

  return { rowCount }
}

function getDataRowIdEncoderString ({ userIdEncoder }) {
  let dataRowIdEncoderString = 'string'.padEnd(maxEncoderTypeLength, ' ')
  if (typeof userIdEncoder === 'string') {
    dataRowIdEncoderString = userIdEncoder.padEnd(maxEncoderTypeLength, ' ')
  }
  return dataRowIdEncoderString
}
