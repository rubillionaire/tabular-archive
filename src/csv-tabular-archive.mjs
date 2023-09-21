import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { readCsvHeaderRow, readCsvDataRows } from './read-csv.mjs'
import { dataRowEncoder } from '../src/data-rows.mjs'
import {
  create as headerRowCreate,
  encode as headerRowEncode,
} from './header-row.mjs'

export async function encode ({
  filePath,
  userHeader,
  userIdForRow,
  userIdEncoder,
}) {
  const tmpFileBase = `ta-intermediate-${
    (new Date()).toISOString()
      .replace(/\:/g, '-')
      .replace(/\./g, '-')
    }`

  const headerParts = [
      {
        name: 'headerRow',
      },
      {
        name: 'categories',
      },
      {
        name: 'dataRowIdEncoderString',
      },
      {
        name: 'dataRowIds',
      },
      {
        name: 'dataRows'
      }
    ].map((part) => {
      return {
        ...part,
        tmpFilePath: `${ tmpFileBase }-${ part.name }`,
      }
    })

  const headerPartsNamed = headerParts
    .map(part => {
      return {
        [part.name]: { ...part }
      }
    })
    .reduce((obj, curr) => {
      return {
        ...obj,
        ...curr
      }
    }, {})

  const { header } = await readCsvHeaderRow({ filePath })
  const { headerRow } = await headerRowCreate({ header, userHeader })
  {
    const { buffer } = await headerRowEncode({ headerRow })
    const filePath = headerPartsNamed.headerRow.tmpFilePath
    await fsp.writeFile(filePath, buffer)
  }
}
