import b4a from 'b4a'
import { encoder as enc } from './encoder.mjs'

export const encode = ({ header, userHeader=[] }) => {
  const specs = header.map(field => {
    const userSpec = userHeader.find(s => s.field === field)
    let encoder = 'string'
    if (userSpec?.encoder) {
      encoder = userSpec.encoder
    }
    return {
      field,
      encoder,
    }
  })

  let bufferLength = specs.map(s => {
    return enc.string.encodingLength(s.field) +
      enc.string.encodingLength(s.encoder) 
  }).reduce((a, c) => a + c, 0)

  const buffer = b4a.alloc(bufferLength)
  bufferLength = 0
  specs.forEach(s => {
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
