import test from 'brittle'
import {
  csvFilePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
} from './user-supplied/redcedar.mjs'
import { encode } from '../src/csv-tabular-archive.mjs'

test('csv-encode', async (t) => {
  await encode({
    csvFilePath,
    userHeader,
    userIdForRow,
    userIdEncoder,
  })
})
