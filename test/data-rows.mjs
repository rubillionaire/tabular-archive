import test from 'brittle'
import b4a from 'b4a'
import fsp from 'node:fs/promises'
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
  const positions = Array.from({ length: 5 }, () => randomInRange())
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

  const samples = {
    dataRows: RandomSampler(lengths.dataRows.length),
    dataRowIds: RandomSampler(lengths.dataRowIds.length),
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

  const rowDecoder = dataRowDecoder({ headerRow })
  const bufferStartEndForIndex = BufferStartEndForBufferLengths(lengths.dataRows)
  const matchingFields = [
    'period-all',
    'period-eph',
    'period-int',
    'period-min-eph',
    'period-min-int',
    'period-per',
    'period-unk',
  ].map(name => [`${name}-nfeat-id`, `${name}-nfeat-period`])
    .reduce((acc, curr) => acc.concat(curr), [])

  for (const sample of samples.dataRows.sample) {
    const { index, value } = sample
    const { start, end } = bufferStartEndForIndex(index)
    const buffer = await ReadStartEnd({
      filePath: filePaths.dataRows,
      start,
      end,
    })
    const { row } = rowDecoder({ buffer })
    for (const field of matchingFields) {
      t.is(row[field], value[field], `Random sample (index:${index}) field ${field} is same.`)  
    }
  }

  t.pass('Sampled data.')

  for (const key in filePaths) {
    const filePath = filePaths[key]
    await fsp.unlink(filePath)
  }
  
  t.end()
})

