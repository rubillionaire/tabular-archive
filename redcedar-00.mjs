/*
- redcedar-00
- adds `cateogry` & `geo` encodings, can roudtrip data
- does not include a header, so this roudtrip can only be done in process
 */

import fs from 'node:fs'
import csv from 'csv-parser'
import {pipe, through} from 'mississippi'
import enc from 'protocol-buffers-encodings'
import lps from 'length-prefixed-stream'

const categories = {}

// TODO should it be possible to move custom encodings into user land?
// - API might have to be bigger since we are doing some silly
// conditional stuff to make this work.
// - we could potentially pull the conditional into the individual functions,
// looking for an object to expand rather than just a singular value to encode
// function encode ({field, value}, buffer, offset) {}
// otherwise we could wrap all `enc` setups to consider field and value
// or we could keep this internal, referencing out that category is a thing
// to hook into, and that its supported by our encode / decode
enc.category = enc.make(7,
  function encode (field, val, buffer, offset) {
    if (!Array.isArray(categories[field])) categories[field] = []
    let valIndex = categories[field].indexOf(val)
    if (valIndex === -1) {
      categories[field].push(val)
      valIndex = categories[field].length - 1
    }
    enc.int32.encode(valIndex, buffer, offset)
    encode.bytes = enc.int32.encode.bytes
    return buffer
  },
  function decode (field, buffer, offset) {
    const valueIndex = enc.int32.decode(buffer.offset)
    decode.bytes = enc.int32.decode.bytes
    // will need to reconstruct the categories[fields] array
    // from a header
    const value = categories[field][valueIndex]
    return value
  },
  function encodingLength (field, val) {
    if (!Array.isArray(categories[field])) categories[field] = []
    let valIndex = categories[field].indexOf(val)
    return enc.int32.encodingLength(valIndex)
  }
)

enc.geo = enc.make(6,
  function encode (val, buffer, offset) {
    const value = Math.floor(val * 10_000_000)
    enc.int32.encode(value, buffer, offset)
    encode.bytes = enc.int32.encode.bytes
    return buffer
  },
  function decode (buffer, offset) {
    const val = enc.int32.decode(buffer, offset)
    decode.bytes = enc.int32.decode.bytes
    return val / 10_000_000
  },
  function encodingLength (val) {
    return enc.int32.encodingLength(Math.floor(val * 10_000_000))
  }
)

const csvStream = csv()

const analyses = [
  'period-all',
  'period-eph',
  'period-int',
  'period-min-eph',
  'period-min-int',
  'period-per',
  'period-unk',
]

const analysesHeaders = analyses.map(name => {
  return [
    {
      field: `${name}-dist`,
      encoding: 'float',
    },
    {
      field: `${name}-nfeat-period`,
      encoding: 'category',
    },
  ]
}).reduce((acc, curr) => acc.concat(curr), [])

const userHeader = [
  {
    field: '',
    encoding: 'int32',
  },
  {
    field: 'latitude',
    encoding: 'geo'
  },
  {
    field: 'longitude',
    encoding: 'geo'
  },
  {
    field: 'reclassified.tree.canopy.symptoms',
    encoding: 'category',
  },
].concat(analysesHeaders)

let header
csvStream.on('headers', (_header) => {
  header = _header
})

function encodeRow ({ row }) {
  const specs = header.map(field => {
    const fieldSpec = userHeader.find(s => s.field === field)
    let encoder = enc.string
    if (fieldSpec?.encoding) {
      encoder = enc[fieldSpec.encoding]
    }
    return {
      encoder,
      value: row[field],
      field,
    }
  })
  const bufLen = specs.map(spec => {
    if (spec.encoder.type === 7) return spec.encoder.encodingLength(spec.field, spec.value)
    else return spec.encoder.encodingLength(spec.value)
  }).reduce((acc, curr) => acc + curr, 0)
  let buffer = Buffer.alloc(bufLen)
  let bufOffset = 0
  specs.forEach(spec => {
    if (spec.encoder.type === 7) spec.encoder.encode(spec.field, spec.value, buffer, bufOffset)
    else spec.encoder.encode(spec.value, buffer, bufOffset)
    bufOffset += spec.encoder.encode.bytes
  })
  return { buffer }
}

function decodeRow ({ buffer }) {
  const row = {}
  let bufLen = 0
  header.forEach(field => {
    const fieldSpec = userHeader.find(s => s.field === field)
    let encoder = enc.string
    if (fieldSpec?.encoding) {
      encoder = enc[fieldSpec.encoding]
    }
    let value
    if (encoder.type === 7) value = encoder.decode(field, buffer, bufLen)
    else value = encoder.decode(buffer, bufLen)
    row[field] = value
    bufLen += encoder.decode.bytes
  })
  return row
}
pipe(
  fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
  csvStream,
  through.obj((row, enc, next) => {
    const { buffer } = encodeRow({ row })
    next(null, buffer)
  }),
  lps.encode(),
  fs.createWriteStream('encoded.lp'),
  (error) => {
    console.log(error)
    pipe(
      fs.createReadStream('encoded.lp'),
      lps.decode(),
      through((buffer, enc, next) => {
        const row = decodeRow({ buffer })
        console.log(row)
        next()
      }),
      (error) => {
        console.log(error)
      })
  }
)
