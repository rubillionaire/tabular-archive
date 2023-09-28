import b4a from 'b4a'
import {
  encoder as enc,
  maxEncoderTypeLength,
} from './encoder.mjs'

export const name = 'TabularArchive'
export const version = 1

/**
 * Return { buffer, bufferLength, fileHead }
 *
 * `buffer` is the header incrementally built out
 * `bufferLength` is the current position in the buffer
 * `fileHead` can be used as the base offset to write data, increment
 * it as new data is written to the file
 */
export function create () {
  let bufferLength = 0
  bufferLength += enc.string.encodingLength(name)
  bufferLength += enc.int32.encodingLength(version)
  // int32 = max 4 bytes
  // int64 = max 8 bytes
  
  // 4 - headerRowStart
  // 4 - headerRowEnd
  bufferLength += (4 + 4)

  // 4 - categoryStart
  // 4 - categoryEnd
  bufferLength += (4 + 4)
  
  // string - dataRowIdEncoderType
  bufferLength += enc.string.encodingLength('string'.padEnd(maxEncoderTypeLength, ' '))
  // 4 - dataRowIdStart
  // 4 - dataRowIdEnd
  bufferLength += (4 + 4)
  
  // 8 - dataRowLengthsStart
  // 8 - dataRowLengthsEnd
  bufferLength += (8 + 8)

  // the remainder of the file is the individual dataRow's encoded
  
  let buffer = b4a.alloc(bufferLength)
  bufferLength = 0
  
  enc.string.encode(name, buffer, bufferLength)
  bufferLength += enc.string.encode.bytes
  enc.int32.encode(version, buffer, bufferLength)
  bufferLength += enc.int32.encode.bytes

  // start writing data after the header
  let fileHead = buffer.byteLength
  
  return {
    buffer,
    bufferLength,
    fileHead,
  }
}

export const decode = ({ buffer, offset=0 }) => {
  const hName = enc.string.decode(buffer, offset)
  offset += enc.string.decode.bytes
  const hVersion = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  if (name !== hName || version !== hVersion) throw Error(`Archive does not conform to v${version}`)
  
  const headerRowStart = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  const headerRowEnd = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  
  const categoriesStart = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  const categoriesEnd = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes

  const dataRowIdsEncoderString = enc.string.decode(buffer, offset).trim()
  offset += enc.string.decode.bytes
  
  const dataRowIdsStart = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  const dataRowIdsEnd = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  
  const dataRowLengthsStart = enc.int64.decode(buffer, offset)
  offset += enc.int64.decode.bytes
  const dataRowLengthsEnd = enc.int64.decode(buffer, offset)
  offset += enc.int64.decode.bytes
  
  // data row buffers written starting at dataRowLengthEnd
  return {
    headerRowStart,
    headerRowEnd,
    categoriesStart,
    categoriesEnd,
    dataRowIdsEncoderString,
    dataRowIdsStart,
    dataRowIdsEnd,
    dataRowLengthsStart,
    dataRowLengthsEnd,
  }
}
