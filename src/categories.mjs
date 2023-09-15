import b4a from 'b4a'
import { encoder as enc } from './encoder.mjs'

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

  return { buffer, bufferLength }
}

export const decode = ({ buffer }) => {
  let offset = 0
  const categories = []
  while (offset < buffer.length - 1) {
    const category = enc.string.decode(buffer, offset)
    offset += enc.string.decode.bytes
    categories.push(category)
  }
  return { categories }
}
