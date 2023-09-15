import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { header as userHeader } from './redcedar-config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export { userHeader }
export const filePath = join(__dirname, 'redcedar-data.csv')
