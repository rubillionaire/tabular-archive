import test from 'brittle'
import fsp from 'node:fs/promises'
import {
  csvFilePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
  archiveFilePath,
  testDataDirectory,
  archiveFilePathName,
} from './user-supplied/redcedar.mjs'
import { encode } from '../src/tabular-archive-encode.mjs'
import { decode } from '../src/tabular-archive-decode.mjs'
import {
  create as headerArchiveCreate,
  decode as headerArchiveDecode,
} from '../src/archive-header.mjs'
import {
  readRange as readRangeFs,
} from '../src/read-range/node-fs.mjs'
import {
  readRange as readRangeFetch,
} from '../src/read-range/fetch.mjs'
import { readCsvDataRows } from '../src/read-csv.mjs'
import { RandomSampler } from './util/random-sampler.mjs'
import { matchingFields } from './util/redcedar.mjs'
import handler from 'serve-handler'
import http from 'http'

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
  t.pass('Populated a random sample of data to verify against the decoder.')
})

const decoderTests = async ({ t, decoder }) => {

  for (const { index, value } of sampler.sample) {
    {
      const { row } = await decoder.getRowBySequence({ rowNumber: index })
      for (const field of matchingFields) {
        t.is(row[field], value[field], `By sequence: random sample (index:${index}) field ${field} is same.`)  
      }
    }
    {
      const id = userIdForRow({ row: value })
      const { row } = await decoder.getRowById({ id })
      for (const field of matchingFields) {
        t.is(row[field], value[field], `By ID: random sample (index:${index}) field ${field} is same.`)  
      }
    }
  }

}


test('archive-decode', async (t) => {
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
  {
    const decoder = await decode({ archiveFilePath, readRange: readRangeFs })
    await decoderTests({ t, decoder })
  }
  {
    const awaitableServer = () => {
      const port = 8080
      const server = http.createServer((request, response) => {
        return handler(request, response, {
          public: testDataDirectory,
        })
      })
      return {
        port,
        listen: () => {
          return new Promise((resolve, reject) => {
            server.listen(port, resolve)
          })
        },
        close: () => {
          return new Promise((resolve, reject) => {
            server.close(resolve)
          })
        },
      }
    }
    const server = awaitableServer()
    await server.listen()
    const decoder = await decode({
      archiveFilePath: `http://localhost:${server.port}/${archiveFilePathName}`,
      readRange: readRangeFetch,
    })
    await decoderTests({ t, decoder })
  }


  await fsp.unlink(archiveFilePath)

  t.pass('Successfully decode the tabular-archive header')
})
