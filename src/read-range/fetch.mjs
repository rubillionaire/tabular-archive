import b4a from 'b4a'

export async function readRange ({ filePath, start, end }) {
  console.log({ filePath, start, end})
  const headers = new Headers()
  headers.append('Range', `bytes=${start}-${end}`)
  const res = await fetch(filePath, { headers })
  const arrayBuffer = await res.arrayBuffer()
  const buffer = b4a.from(arrayBuffer, 0, end-start)
  return buffer
}
