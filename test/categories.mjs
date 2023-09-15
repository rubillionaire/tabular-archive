import test from 'brittle'
import { categories } from '../src/encoder.mjs'
import { readCsvHeaderRow, readCsvDataRows } from '../src/read-csv.mjs'
import { encode, decode } from '../src/categories.mjs'
import { dataRowEncoder } from '../src/data-row.mjs'
import { userHeader, filePath } from './user-supplied/redcedar.mjs'

test('encode-decode', async (t) => {
  const { header } = await readCsvHeaderRow({ filePath })
  const rowEncoder = dataRowEncoder({ header, userHeader })
  const onRow = async ({ row }) => {
    // running through all values for encoding lenths will
    // load all `categories`, which get exported from our
    // encoder
    rowEncoder.encodingLength({ row })
  }
  await readCsvDataRows({ filePath, onRow })
  const { buffer } = await encode({ categories })
  const decoded = await decode({ buffer })
  t.is(categories.length, decoded.categories.length, 'Same categories length')
  t.end()
})
