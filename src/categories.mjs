import b4a from 'b4a'
import { encoder as enc } from './encoder.mjs'
import { gzipSync, gunzipSync } from 'fflate'

export const encode = ({ categories }) => {
  let bufferLength = categories.map(s => {
    return enc.string.encodingLength(s)
  }).reduce((a, c) => a + c, 0)
  let buffer = b4a.alloc(bufferLength)
  bufferLength = 0
  categories.forEach(s => {
    enc.string.encode(s, buffer, bufferLength)
    bufferLength += enc.string.encode.bytes
  })

  const compressedBuffer = gzipSync(buffer)

  return {
    buffer: compressedBuffer,
    bufferLength: compressedBuffer.length,
  }
}

export const decode = ({ buffer, offset=0 }) => {
  const uncompressedBuffer = gunzipSync(buffer)

  const categories = []
  while (offset < uncompressedBuffer.length - 1) {
    const category = enc.string.decode(uncompressedBuffer, offset)
    offset += enc.string.decode.bytes
    categories.push(category)
  }
  return { categories, offset }
}
