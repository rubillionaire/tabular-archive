import { readRange } from './src/read-range/fetch.mjs'
import { decode } from './src/tabular-archive-decode.mjs'
export { decode }
export const decodeFetch = decode({ readRange })
