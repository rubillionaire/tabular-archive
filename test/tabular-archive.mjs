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

const decoderTests = async ({ t, decoder, headerRow }) => {
  for (const { index, value } of sampler.sample) {
    {
      const { row } = await decoder.getRowBySequence({ rowNumber: index })
      const tester = matchingFields({ t, headerRow, msgPrefix: `By sequence: random sample (index:${index})` })
      tester(row, value)
    }
    {
      const id = userIdForRow({ row: value })
      const { row } = await decoder.getRowById({ id })
      const tester = matchingFields({ t, headerRow, msgPrefix: `By ID: random sample (index:${index})` })
      tester(row, value)
    }
  }

}

test('archive-decode:fs', async (t) => {
  const decoder = await decode({ readRange: readRangeFs })({ archiveFilePath })
  await decoderTests({ t, decoder, headerRow: decoder.headerRow })
  t.pass('Successfully decode the tabular-archive using node-fs interface')
})

test('archive-decode:fetch', async (t) => {
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

  const decoder = await decode({ readRange: readRangeFetch })({
    archiveFilePath: `http://localhost:${server.port}/${archiveFilePathName}`,
  })

  await decoderTests({ t, decoder, headerRow: decoder.headerRow })

  let counter = -1
  const pageCount = 10
  const startRowNumber = 0
  const endRowNumber = pageCount - 1
  for await (const { row } of decoder.getRowsBySequence({ startRowNumber, endRowNumber })) {
    counter += 1
  }
  t.alike(counter, endRowNumber, 'Got range by sequence')

  counter = -1
  for await (const { row } of decoder.getRowsByIdWithPage({ id: 151650727, pageCount })) {
    counter += 1
  }
  t.alike(counter, endRowNumber, 'Got range by id')

  await server.close()

  t.pass('Successfully decode the tabular-archive using fetch interface')
})

test('delete-archive', async (t) => {
  await fsp.unlink(archiveFilePath)
})
