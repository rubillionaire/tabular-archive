import { readRange } from './src/read-range/fetch.mjs'
export { decode } from './src/tabular-archive-decode.mjs'
export const decodeFetch = decode({ readRange })
