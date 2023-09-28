// import assert from 'node:assert'
import b4a from 'b4a'
import { encoder as enc } from './encoder.mjs'

export const dataRowEncoder = ({ headerRow }) => {
  const fieldSpecs = ({ row }) => {
    return headerRow.map((fieldSpec) => {
      const encoder = enc[fieldSpec.encoder]
      if (!encoder) throw new Error(`Could not find encoder for field ${fieldSpec.field}`)
      return {
        encoder,
        value: row[fieldSpec.field],
        field: fieldSpec.field,
      }
    })
  }

  function encodingLength ({ row }) {
    const specs = fieldSpecs({ row })
    const bufferLength = specs.map(spec => {
      return spec.encoder.encodingLength(spec.value)
    }).reduce((acc, curr) => acc + curr, 0)

    return { bufferLength }
  }

  function encode ({ row }) {
    const specs = fieldSpecs({ row })
    const { bufferLength } = encodingLength({ row })
    let buffer = b4a.alloc(bufferLength)
    let bufOffset = 0
    specs.forEach(spec => {
      spec.encoder.encode(spec.value, buffer, bufOffset)
      bufOffset += spec.encoder.encode.bytes
    })
    // assert.equal(bufferLength, bufOffset)
    return { buffer, bufferLength }
  }

  return {
    encodingLength,
    encode,
  }
}

export const dataRowDecoder = ({ headerRow }) => {
  return ({ buffer, offset=0 }) => {
    const row = {}
    headerRow.forEach(headerSpec => {
      const encoder = enc[headerSpec.encoder]
      const value = encoder.decode(buffer, offset)
      offset += encoder.decode.bytes
      row[headerSpec.field] = value
    })
    return {
      row,
      buffer,
      offset,
    }
  }

}
