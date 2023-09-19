import fs from 'node:fs'

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
