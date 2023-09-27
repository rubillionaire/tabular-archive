import b4a from 'b4a'

export async function readRange ({ filePath, start, end, ranges }) {
  const headers = new Headers()
  if (!ranges) {
    ranges = [{ start, end }]
  }
  const byteRange = `bytes=${ ranges.map(r => `${r.start}-${r.end}`).join(', ') }`
  headers.append('Range', byteRange)
  const res = await fetch(filePath, { headers })
  const arrayBuffer = await res.arrayBuffer()
  const buffer = b4a.from(arrayBuffer, 0, end-start)
  return buffer
}
