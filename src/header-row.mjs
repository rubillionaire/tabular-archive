import b4a from 'b4a'
import { encoder as enc } from './encoder.mjs'

export const create = ({ header, userHeader=[] }) => {
  const headerRow = header.map(field => {
    const userSpec = userHeader.find(s => s.field === field)
    let encoder = 'string'
    if (typeof userSpec?.encoder === 'string') {
      encoder = userSpec.encoder
    }
    return {
      field,
      encoder,
    }
  })
  
  return { headerRow }
}

export const encode = ({ headerRow }) => {
  let bufferLength = headerRow.map(s => {
    return enc.string.encodingLength(s.field) +
      enc.string.encodingLength(s.encoder) 
  }).reduce((a, c) => a + c, 0)

  const buffer = b4a.alloc(bufferLength)
  bufferLength = 0
  headerRow.forEach(s => {
    enc.string.encode(s.field, buffer, bufferLength)
    bufferLength += enc.string.encode.bytes
    enc.string.encode(s.encoder, buffer, bufferLength)
    bufferLength += enc.string.encode.bytes
  })

  return {
    buffer,
    bufferLength,
  }
}

export const decode = ({ buffer }) => {
  let offset = 0
  const headerRow = []
  while (offset <  buffer.length - 1) {
    const field = enc.string.decode(buffer, offset)
    offset += enc.string.decode.bytes
    const encoder = enc.string.decode(buffer, offset)
    offset += enc.string.decode.bytes
    headerRow.push({
      field,
      encoder,
    })
  }
  return { headerRow }
}
