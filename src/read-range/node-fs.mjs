import b4a from 'b4a'
import fs from 'node:fs'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

export async function readRange ({ filePath, start, end, ranges }) {
  let completeBuffer = b4a.alloc(0)
  if (!ranges) {
    ranges = [{ start, end }]
  }
  const captureBuffer = () => new Writable({
    write: (buffer, enc, next) => {
      const len = completeBuffer.length + buffer.length
      completeBuffer = b4a.concat([completeBuffer, buffer], len)
      next()
    },
  })
  return new Promise(async (resolve, reject) => {
    for (const range of ranges) {
      await pipeline(
        fs.createReadStream(filePath, { ...range }),
        captureBuffer())
    }

    resolve(completeBuffer)
  })
}
