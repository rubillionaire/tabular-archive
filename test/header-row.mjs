import test from 'brittle'
import { readCsvHeaderRow } from '../src/read-csv.mjs'
import { create, encode, decode } from '../src/header-row.mjs'
import { userHeader, filePath } from './user-supplied/redcedar.mjs'

test('header-rows:encode-decode', async (t) => {
  const { header } = await readCsvHeaderRow({ filePath })
  const created = await create({ header, userHeader })
  const { buffer } = await encode(created)
  const decoded = await decode({ buffer })
  t.alike(created.headerRow, decoded.headerRow, 'Header row is alike')
  t.end()
})
