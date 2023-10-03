import test from 'brittle'
import b4a from 'b4a'
import fsp from 'node:fs/promises'
import { gzipSync, gunzipSync } from 'fflate'
import { encoder as enc, categories } from '../src/encoder.mjs'
import { create } from '../src/header-row.mjs'
import { readCsvHeaderRow, readCsvDataRows } from '../src/read-csv.mjs'
import { dataRowEncoder, dataRowDecoder } from '../src/data-rows.mjs'
import {
  AwaitableWriteStream,
  ReadStartEnd,
} from '../src/stream-helpers.mjs'
import { userIdEncoderFn } from '../src/user-supplied.mjs'
import {
  csvFilePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
} from './user-supplied/redcedar.mjs'
import { RandomSampler } from './util/random-sampler.mjs'
import { matchingFields } from './util/redcedar.mjs'

test('data-rows', async (t) => {
  // TODO this `lengths` exercise should be moved to a place where
  // we are supporting writing of the entire header. to write the
  // header we need to know all pieces

  // find our encoding lengths to determine offsets that get used
  // in the header to let consumers know where to find data
  const lengths = {
    dataRows: [],
    dataRowIds: [],
  }
  const { header } = await readCsvHeaderRow({ filePath: csvFilePath })
  const { headerRow } = create({ header, userHeader })
  const rowEncoder = dataRowEncoder({ headerRow })
  const dataRowIdEncoder = userIdEncoderFn({ idEncoder: userIdEncoder })
  const onRowEncodeLengths = async ({ row }) => {
    {
      // const { bufferLength } = rowEncoder.encodingLength({ row })
      // lengths.dataRows.push(bufferLength)
      const { buffer } = rowEncoder.encode({ row })
      const compressedBuffer = gzipSync(buffer)
      // lengths.dataRows.push(compressedBuffer.length)
      // write out the value encoded in a buffer instead
      const encodedLengthBuffer = b4a.alloc(enc.int64.encodingLength(compressedBuffer.length))
      enc.int64.encode(compressedBuffer.length, encodedLengthBuffer, 0)
      lengths.dataRows.push(encodedLengthBuffer)
    }
    {
      const id = userIdForRow({ row })
      const bufferLength = dataRowIdEncoder.encodingLength(id)
      lengths.dataRowIds.push(bufferLength)
    }
  }
  await readCsvDataRows({ filePath: csvFilePath, onRow: onRowEncodeLengths })

  t.pass('Read in data rows and IDs for header creation')

  const samples = {
    dataRows: RandomSampler({ sampleLength: lengths.dataRows.length }),
    dataRowIds: RandomSampler({ sampleLength: lengths.dataRowIds.length }),
  }

  // knowing our total buffer size we could try to create that buffer
  // and write to it, but it might be large, so we might as well use
  // our final interface, writing to a file
  // we use our lengths above to know where to seek for row data
  
  const filePaths = {
    dataRows: 'redcedar-data-rows',
    dataRowIds: 'redcedar-data-row-ids',
  }

  // do the actual encoding
  const writers = {
    dataRows: AwaitableWriteStream(filePaths.dataRows),
    dataRowIds: AwaitableWriteStream(filePaths.dataRowIds),
  }

  const onRowEncode = async ({ row }) => {
    {
      const { buffer } = rowEncoder.encode({ row })
      // writers.dataRows.write(buffer)
      const compressedBuffer = gzipSync(buffer)
      writers.dataRows.write(compressedBuffer)
      samples.dataRows.save(row)
    }
    {
      const id = userIdForRow({ row })
      const bufferLength = dataRowIdEncoder.encodingLength(id)
      let buffer = b4a.alloc(bufferLength)
      dataRowIdEncoder.encode(id, buffer, 0)
      writers.dataRowIds.write(buffer)
      samples.dataRowIds.save(row)
    }
  }
  await readCsvDataRows({ filePath: csvFilePath, onRow: onRowEncode })
  for (const key in writers) {
    await writers[key].end()
  }

  t.pass('Wrote data rows.')

  function BufferStartEndForBufferLengths (bufferLengths) {
    const sum = (accumulator, current) => {
      const decoded = enc.int64.decode(current, 0)
      return accumulator + decoded
    }
    return (index) => {
      let start = bufferLengths.slice(0, index).reduce(sum, 0)
      const encodedBuffer = bufferLengths.slice(index, index + 1)[0]
      const decodedIndex = enc.int64.decode(encodedBuffer, 0)
      let end = start + decodedIndex
      return {
        start,
        end,
      }
    }
  }

  const rowDecoder = dataRowDecoder({ headerRow })
  const bufferStartEndForIndex = BufferStartEndForBufferLengths(lengths.dataRows)

  for (const sample of samples.dataRows.sample) {
    const { index, value } = sample
    const { start, end } = bufferStartEndForIndex(index)
    const buffer = await ReadStartEnd({
      filePath: filePaths.dataRows,
      start,
      end,
    })
    // const { row } = rowDecoder({ buffer })
    const uncompressedBuffer = gunzipSync(buffer)
    const { row } = rowDecoder({ buffer: uncompressedBuffer })
    const tester = matchingFields({ t, headerRow, msgPrefix: `Random sample (index:${index})` })
    tester(row, value)
  }

  t.pass('Sampled data.')

  for (const key in filePaths) {
    const filePath = filePaths[key]
    await fsp.unlink(filePath)
  }
  
  t.end()
})

