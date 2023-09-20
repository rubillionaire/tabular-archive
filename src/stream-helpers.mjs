import fs from 'node:fs'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

export const AwaitableWriteStream = (fileName) => {
  const writer = fs.createWriteStream(fileName)

  return {
    write: (buffer) => {
      writer.write(buffer)
    },
    end: () => {
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.end()
      })
    },
  }
}

export async function ReadStartEnd ({ filePath, start, end }) {
  let completeBuffer
  return new Promise(async (resolve, reject) => {
    const captureBuffer = new Writable({
      write: (buffer, enc, next) => {
        if (completeBuffer)  {
          const len = completeBuffer.length + buffer.length
          completeBuffer = Buffer.concat([completeBuffer, buffer], len)
        }
        else {
          completeBuffer = buffer
        }
        next()
      },
    })
console.log({filePath, start, end})
    await pipeline(
      fs.createReadStream(filePath, {
        start,
        end,
      }),
      captureBuffer)

    resolve(completeBuffer)
  })
}