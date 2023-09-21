import test from 'brittle'
import { userHeader, filePath } from './user-supplied/redcedar.mjs'
import { encode } from '../src/csv-tabular-archive.mjs'

test('csv-encode', async (t) => {
  await encode({ filePath, userHeader })
})
