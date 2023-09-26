import { readRange } from './src/read-range/node-fs.mjs'
export { encode } from './src/tabular-archive-encode.mjs'
export { decode } from './src/tabular-archive-decode.mjs'
export const decodeFs = decode({ readRange })
