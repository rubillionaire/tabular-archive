import fs from 'node:fs'
import csv from 'csv-parser'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const EARLY_EXIT_ERROR = 'early-exit'

export const readCsvHeaderRow = async ({ filePath }) => {
  const csvStream = csv()
  let header

  csvStream.on('headers', (_header) => {
    header = _header
  })

  // we early exit, we only need the header from this
  const sink = new Writable({
    objectMode: true,
    write: (row, enc, next) => {
      next(new Error(EARLY_EXIT_ERROR))
    },
  })

  try { 
    await pipeline(
      fs.createReadStream(filePath),
      csvStream,
      sink) 
  }
  catch (error) {
    if (error.message === EARLY_EXIT_ERROR) {
      // swallow the early-exit error
    }
    else {
      throw error
    }
  }
  finally {
    return { header }
  }
}

export const readCsvDataRows = async ({ filePath, onRow }) => {
  const sink = new Writable({
    objectMode: true,
    write: async (row, enc, next) => {
      await onRow({ row })
      next()
    },
  })

  await pipeline(
    fs.createReadStream(filePath),
    csv(),
    sink)
}
