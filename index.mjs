import { readRange } from './src/read-range/node-fs.mjs'
export { encode } from './src/tabular-archive-encode.mjs'
import { decode } from './src/tabular-archive-decode.mjs'
export { decode }
export const decodeFs = decode({ readRange })
export { encoderTypes } from './src/encoder.mjs'