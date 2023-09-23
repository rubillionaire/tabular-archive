import { userIdEncoderFn } from '../../src/user-supplied.mjs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  header as userHeader,
  idForRow as userIdForRow,
  idEncoder,
} from './redcedar-config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const testDataDirectory = __dirname

export const userIdEncoder = idEncoder
export { userHeader, userIdForRow }

export const csvFilePath = join(__dirname, 'redcedar-data.csv')
// for testing
export const archiveFilePathName = 'redcedar.ta'
export const archiveFilePath = join(__dirname, archiveFilePathName)
