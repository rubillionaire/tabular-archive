import encoder from 'protocol-buffers-encodings'

export { encoder }

export let categories = []
export const setCategories = (c) => {
  categories = c
}

encoder.date = encoder.make(8,
  function encode (val, buffer, offset) {
    const date = new Date(val)
    let timestamp = date.getTime()
    if (isNaN(timestamp)) {
      timestamp = -1
    }
    encoder.int64.encode(timestamp, buffer, offset)
    encode.bytes = encoder.int64.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const timestamp = encoder.int64.decode(buffer, offset)
    decode.bytes = encoder.int64.decode.bytes
    const date = new Date(timestamp)
    const value = date.toISOString()
    return value
  },
  function encodingLength (val) {
    const date = new Date(val)
    let timestamp = date.getTime()
    if (isNaN(timestamp)) {
      timestamp = -1
    }
    return encoder.int64.encodingLength(timestamp)
  }
)

encoder.category = encoder.make(7,
  function encode (val, buffer, offset) {
    let valueIndex = categories.indexOf(val)
    if (valueIndex === -1) {
      categories.push(val)
      valueIndex = categories.length - 1
    }
    encoder.int32.encode(valueIndex, buffer, offset)
    encode.bytes = encoder.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const valueIndex = encoder.int32.decode(buffer, offset)
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

const encoderTypeKeys = Object.keys(encoder)
  .filter(type => {
    return typeof encoder[type].encodingLength === 'function' &&
      typeof encoder[type].encode === 'function' &&
      typeof encoder[type].decode === 'function'
  })

export const encoderTypes = encoderTypeKeys
  .map(type => {
    return { [type]: type }
  })
  .reduce((accumulator, current) => {
    return {
      ...accumulator,
      ...current,
    }
  }, {})

export const maxEncoderTypeLength = encoderTypeKeys
  .map(type => type.length)
  .sort()
  .pop()
