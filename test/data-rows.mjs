import test from 'brittle'
import b4a from 'b4a'
import { categories } from '../src/encoder.mjs'
import { create } from '../src/header-row.mjs'
import { readCsvHeaderRow, readCsvDataRows } from '../src/read-csv.mjs'
import { dataRowEncoder, dataRowDecoder } from '../src/data-rows.mjs'
import {
  AwaitableWriteStream,
  ReadStartEnd,
} from '../src/stream-helpers.mjs'
import {
  userHeader,
  filePath,
  userIdForRow,
  userIdEncoder,
} from './user-supplied/redcedar.mjs'


const RandomSampler = (sampleLength) => {
  let counter = -1
  const randomInRange = () => Math.floor(Math.random() * sampleLength)
  // const positions = Array.from({ length: 5 }, () => randomInRange())
  const positions = Array.from({ length: 1 }, () => 0)
  const sample = []

  return {
    save: (value) => {
      counter += 1
      if (positions.indexOf(counter) === -1) return
      sample.push({
        index: counter,
        value: { ...value },
      })
    },
    sample,
  }
}

test('data-rows', async (t) => {
  // find our encoding lengths to determine offsets that get used
  // in the header to let consumers know where to find data
  const lengths = {
    dataRows: [],
    dataRowIds: [],
  }
  const { header } = await readCsvHeaderRow({ filePath })
  const { headerRow } = create({ header, userHeader })
  const rowEncoder = dataRowEncoder({ headerRow })
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

  t.pass('Read in data rows and IDs for header creation')
  console.log({ categories })

  const samples = {
    dataRows: RandomSampler(lengths.dataRows.length),
    dataRowIds: RandomSampler(lengths.dataRowIds.length),
  }

  // knowing our total buffer size we could try to create that buffer
  // and write to it, but it might be large, so we might as well use
  // our final interface, writing to a file
  
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

  t.pass('Wrote data rows.')
  console.log({ categories })

  function BufferStartEndForBufferLengths (bufferLengths) {
    const sum = (accumulator, current) => accumulator + current
    return (index) => {
      let start = bufferLengths.slice(0, index).reduce(sum, 0)
      let end = start + bufferLengths.slice(index, index + 1)[0]
      return {
        start,
        end,
      }
    }
  }

  // TODO we sample results to verify after reading/writing, lets do it here
  const rowDecoder = dataRowDecoder({ headerRow })
  const bufferStartEndForIndex = BufferStartEndForBufferLengths(lengths.dataRows)
  for (const sample of samples.dataRows.sample) {
    const { index, value } = sample
    const { start, end } = bufferStartEndForIndex(index)
    console.log({index, start, end})
    const buffer = await ReadStartEnd({
      filePath: filePaths.dataRows,
      start,
      end,
    })
    const { row } = rowDecoder({ buffer })
    console.log({value})
    console.log({row})
    t.alike(value, row, 'Random sample is alike.')
  }

  t.pass('Sampled data.')
  
  t.end()
})

