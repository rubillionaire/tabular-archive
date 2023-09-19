import test from 'brittle'
import b4a from 'b4a'
import { categories } from '../src/encoder.mjs'
import { readCsvHeaderRow, readCsvDataRows } from '../src/read-csv.mjs'
import { dataRowEncoder } from '../src/data-rows.mjs'
import { AwaitableWriteStream } from '../src/awaitable-write-stream.mjs'
import {
  userHeader,
  filePath,
  userIdForRow,
  userIdEncoder,
} from './user-supplied/redcedar.mjs'

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
  const { header } = await readCsvHeaderRow({ filePath })
  const rowEncoder = dataRowEncoder({ header, userHeader })
  const onRowEncodeLengths = async ({ row }) => {
    {
      const { bufferLength } = rowEncoder.encodingLength({ row })
      lengths.dataRows.push(bufferLength)  
    }
    {
      const id = userIdForRow({ row })
      const bufferLength = userIdEncoder.encodingLength(id)
      lengths.dataRowIds.push(bufferLength)
    }
  }
  await readCsvDataRows({ filePath, onRow: onRowEncodeLengths })

  const randomInRange = () => Math.floor(Math.random() * lengths.dataRows.length)

  const RandomSampler = () => {
    let counter = -1
    const positions = Array.from({ length: 5 }, () => randomInRange())
    const sample = []

    return {
      save: (value) => {
        counter += 1
        if (positions.indexOf(counter) === -1) return
        sample.push({
          index: counter,
          value,
        })
      },
      sample,
    }
  }

  const samples = {
    dataRows: RandomSampler(),
    dataRowIds: RandomSampler(),
  }

  // knowing our total buffer size we could try to create that buffer
  // and write to it, but it might be large, so we might as well use
  // our final interface, writing to a file

  // do the actual encoding
  const writers = {
    dataRows: AwaitableWriteStream('redcedar-data-rows'),
    dataRowIds: AwaitableWriteStream('redcedar-data-row-ids'),
  }

  const onRowEncode = async ({ row }) => {
    {
      const { buffer } = rowEncoder.encode({ row })
      writers.dataRows.write(buffer)
      samples.dataRows.save(row)
    }
    {
      const id = userIdForRow({ row })
      const bufferLength = userIdEncoder.encodingLength(id)
      let buffer = b4a.alloc(bufferLength)
      userIdEncoder.encode(id, buffer, 0)
      writers.dataRowIds.write(buffer)
      samples.dataRowIds.save(row)
    }
  }
  await readCsvDataRows({ filePath, onRow: onRowEncode })

  // TODO we sample results to verify after reading/writing, lets do it here
  
  t.end()
})

