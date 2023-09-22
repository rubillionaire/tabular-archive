import b4a from 'b4a'
import {
  encoder as enc,
  maxEncoderTypeLength,
} from './encoder.mjs'

export const name = 'TabularArchive'
export const version = 1

/**
 * Return { buffer, bufferLength }
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
  
  // 4 - headerRowOffset
  // 4 - headerRowLength
  bufferLength += (4 + 4)

  // 4 - categoryOffset
  // 4 - categoryLength
  bufferLength += (4 + 4)
  
  // string - dataRowIdEncoderType
  bufferLength += enc.string.encodingLength('string'.padEnd(maxEncoderTypeLength, ' '))
  // 4 - dataRowIdOffset
  // 4 - dataRowIdLength
  bufferLength += (4 + 4)
  
  // 8 - dataRowLengthsOffset
  // 8 - dataRowLengthsLength
  bufferLength += (8 + 8)

  // the remainder of the file is the individual dataRow's encoded
  
  let buffer = b4a.alloc(bufferLength)
  bufferLength = 0
  
  enc.string.encode(name, buffer, bufferLength)
  bufferLength += enc.string.encode.bytes
  enc.int32.encode(version, buffer, bufferLength)
  bufferLength += enc.int32.encode.bytes

  // start writing data after the header
  let fileHead = buffer.length
  
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
    
    const headerRowOffsetStart = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const headerRowOffsetEnd = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    
    const categoriesOffsetStart = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const categoriesOffsetEnd = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes

    const dataRowIdsEncoderString = enc.string.decode(buffer, offset).trim()
    offset += enc.string.decode.bytes
    
    const dataRowIdsOffsetStart = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    const dataRowIdsOffsetEnd = enc.int32.decode(buffer, offset)
    offset += enc.int32.decode.bytes
    
    const dataRowLengthsOffsetStart = enc.int64.decode(buffer, offset)
    offset += enc.int64.decode.bytes
    const dataRowLengthsOffsetEnd = enc.int64.decode(buffer, offset)
    offset += enc.int64.decode.bytes
    
    // data row buffers written starting at dataRowLength
    return {
      headerRowOffsetStart,
      headerRowOffsetEnd,
      categoriesOffsetStart,
      categoriesOffsetEnd,
      dataRowIdsEncoderString,
      dataRowIdsOffsetStart,
      dataRowIdsOffsetEnd,
      dataRowLengthsOffsetStart,
      dataRowLengthsOffsetEnd,
    }
}
