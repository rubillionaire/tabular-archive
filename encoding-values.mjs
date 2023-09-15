import encodings from 'protocol-buffers-encodings'

// PMTiles header is
let bufLen = 0
bufLen += encodings.string.encodingLength('PMTiles')
bufLen += encodings.int32.encodingLength(3)
console.log({bufLen})
let buf = Buffer.alloc(bufLen)
bufLen = 0
encodings.string.encode('PMTiles', buf, bufLen)
bufLen += encodings.string.encode.bytes
encodings.string.encode('Another', buf, bufLen)
bufLen += encodings.string.encode.bytes
encodings.int32.encode(3, buf, bufLen)
bufLen += encodings.int32.encode.bytes
console.log({bufLen})

console.log(encodings.string.decode(buf, 0))