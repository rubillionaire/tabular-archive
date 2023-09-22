import test from 'brittle'
import {
  csvFilePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
  archiveFilePath,
} from './user-supplied/redcedar.mjs'
import { encode } from '../src/tabular-archive-encode.mjs'
import { decode } from '../src/tabular-archive-decode.mjs'
import {
  create as headerArchiveCreate,
  decode as headerArchiveDecode,
} from '../src/archive-header.mjs'
import {
  ReadStartEnd,
} from '../src/stream-helpers.mjs'
import { readCsvDataRows } from '../src/read-csv.mjs'
import { RandomSampler } from './util/random-sampler.mjs'
import { matchingFields } from './util/redcedar.mjs'

let rowCount = -1
let sampler

test('csv-encode', async (t) => {
  const results = await encode({
    csvFilePath,
    userHeader,
    userIdForRow,
    userIdEncoder,
    archiveFilePath,
  })
  t.pass('Successfully encoded CSV into tabular-archive')

  rowCount = results.rowCount
  sampler = RandomSampler({ sampleLength: rowCount })
})

test('populate-sampler', async (t) => {
  const onRow = ({ row }) => {
    sampler.save(row)
  }
  await readCsvDataRows({  filePath: csvFilePath, onRow })
})


test('csv-decode', async (t) => {
  // this is wherer we can test out the user facing api
  /*
  import {
    getRowBySequence({ rowNumber }),
    getRowById({ id }),
    getRangeBySequence({ startRowNumber, endRowNumber }),
    getRangeById({ id, surrounding }),
  } from 'tabular-archive/node'

  import {
    getRowBySequence({ rowNumber }),
    getRowById({ id }),
    getRangeBySequence({ startRowNumber, endRowNumber }),
    getRangeById({ id, surrounding }),
  } from 'tabular-archive/browser'
   */
  
  const decoder = await decode({ archiveFilePath })

  for (const { index, value } of sampler.sample) {
    const { row } = await decoder.getRowBySequence({ rowNumber: index })
    console.log({ row })
    for (const field of matchingFields) {
      t.is(row[field], value[field], `Random sample (index:${index}) field ${field} is same.`)  
    }
  }

  t.pass('Successfully decode the tabular-archive header')
})
