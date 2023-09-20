import test from 'brittle'
import { categories } from '../src/encoder.mjs'
import { readCsvHeaderRow, readCsvDataRows } from '../src/read-csv.mjs'
import { create } from '../src/header-row.mjs'
import { encode, decode } from '../src/categories.mjs'
import { dataRowEncoder } from '../src/data-rows.mjs'
import { userHeader, filePath } from './user-supplied/redcedar.mjs'

test('categpries:encode-deocde', async (t) => {
  const { header } = await readCsvHeaderRow({ filePath })
  const { headerRow } = create({ header, userHeader })
  const rowEncoder = dataRowEncoder({ headerRow })
  const onRow = async ({ row }) => {
    // running through all values for encoding lenths will
    // load all `categories`, which get exported from our
    // encoder
    rowEncoder.encodingLength({ row })
  }
  await readCsvDataRows({ filePath, onRow })
  const { buffer } = await encode({ categories })
  const decoded = await decode({ buffer })
  t.alike(categories, decoded.categories, 'Categories value')
  t.end()
})
