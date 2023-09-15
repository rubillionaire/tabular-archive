import encoder from 'protocol-buffers-encodings'

export { encoder}

export const categories = []

encoder.category = encoder.make(7,
  function encode (val, buffer, offset) {
    let valIndex = categories.indexOf(val)
    if (valIndex === -1) {
      categories.push(val)
      valIndex = categories.length - 1
    }
    encoder.int32.encode(valIndex, buffer, offset)
    encode.bytes = encoder.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const valueIndex = encoder.int32.decode(buffer.offset)
    decode.bytes = encoder.int32.decode.bytes
    // will need to reconstruct the categories[fields] array
    // from a header
    const value = categories[valueIndex]
    return value
  },
  function encodingLength (val) {
    let valIndex = categories.indexOf(val)
    if (valIndex === -1) {
      categories.push(val)
      valIndex = categories.length - 1
    }
    return encoder.int32.encodingLength(valIndex)
  }
)

encoder.geo = encoder.make(6,
  function encode (val, buffer, offset) {
    const value = Math.floor(val * 10_000_000)
    encoder.int32.encode(value, buffer, offset)
    encode.bytes = encoder.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const val = encoder.int32.decode(buffer, offset)
    decode.bytes = encoder.int32.decode.bytes
    return val / 10_000_000
  },
  function encodingLength (val) {
    return encoder.int32.encodingLength(Math.floor(val * 10_000_000))
  }
)

export const maxEncoderTypeLength = Object.keys(encoder)
  .map(type => type.length)
  .sort()
  .pop()
