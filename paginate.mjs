import enc from 'protocol-buffers-encodings'

const data = [0, 1, 2, 2_000_005, 4, 5]

const bufferLength = data.map(d => enc.int32.encodingLength(d)).reduce((a,c) => a + c, 0)

console.log({bufferLength})

const buffer = Buffer.alloc(bufferLength)
let offset = 0

data.forEach(d => {
  enc.int32.encode(d, buffer, offset)
  offset += enc.int32.encode.bytes
})

offset = 0
while (offset < bufferLength) {
  const value = enc.int32.decode(buffer, offset)
  offset += enc.int32.decode.bytes
  console.log(value)
}

