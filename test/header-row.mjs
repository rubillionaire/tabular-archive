import test from 'brittle'
import { readCsvHeaderRow } from '../src/read-csv.mjs'
import { encode, decode } from '../src/header-row.mjs'
import { userHeader, filePath } from './user-supplied/redcedar.mjs'

test('encode-decode', async (t) => {
  const { header } = await readCsvHeaderRow({ filePath })
  const { buffer } = await encode({ header, userHeader })
  const { headerRow } = await decode({ buffer })
  t.is(header.length, headerRow.length, 'Same header length')
  t.end()
})
