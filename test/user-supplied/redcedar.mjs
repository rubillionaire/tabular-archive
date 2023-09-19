import { userIdEncoderFn } from '../../src/user-supplied.mjs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  header as userHeader,
  idForRow as userIdForRow,
  idEncoder,
} from './redcedar-config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const userIdEncoder = userIdEncoderFn({ idEncoder })

export { userHeader, userIdForRow, userIdEncoder }
export const filePath = join(__dirname, 'redcedar-data.csv')
