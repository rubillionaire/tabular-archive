import { encoder as enc } from './encoder.mjs'

export function userIdEncoderFn ({ idEncoder }) {
  let encoder = enc.string
  if (typeof idEncoder === 'string') {
    encoder = enc[idEncoder]
  }
  return encoder
}
