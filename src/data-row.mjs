import { encoder as enc } from './encoder.mjs'

export const dataRowEncoder = ({ header, userHeader }) => {
  const fieldSpecs = ({ row }) => (field) => {
    const fieldSpec = userHeader.find(s => s.field === field)
    let encoder = enc.string
    if (fieldSpec?.encoder) {
      encoder = enc[fieldSpec.encoder]
    }
    if (!encoder) throw new Error(`Could not find encoder for field ${field}`)
    return {
      encoder,
      value: row[field],
      field,
    }
  }

  function encodingLength ({ row }) {
    const specs = header.map(fieldSpecs({ row }))
    const bufferLength = specs.map(spec => {
      return spec.encoder.encodingLength(spec.value)
    }).reduce((acc, curr) => acc + curr, 0)

    return { bufferLength }
  }

  function encode ({ row }) {
    const specs = header.map(fieldSpecs({ row }))
    const { bufferLength } = encodingLength({ row })
    let buffer = b4a.alloc(bufferLength)
    let bufOffset = 0
    specs.forEach(spec => {
      spec.encoder.encode(spec.value, buffer, bufOffset)
      bufOffset += spec.encoder.encode.bytes
    })
    assert.equal(bufferLength, bufOffset)
    return { buffer, bufferLength }
  }

  return {
    encodingLength,
    encode,
  }
}
