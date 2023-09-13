/*
This is a little test to make sure i could round trip data
and i can!
and it turns out that doing string encoding doesn't
actually save any room here, lol. maybe if we
actually decode some of the fields by passing in a header
that can determine what to do with these things
 */

import fs from 'node:fs'
import csv from 'csv-parser'
import {pipe, through} from 'mississippi'
import enc from 'protocol-buffers-encodings'
import varint from 'varint'
import lps from 'length-prefixed-stream'

const categories = {}

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
  let buf = Buffer.alloc(bufLen)
  let bufOffset = 0
  specs.forEach(spec => {
    if (spec.encoder.type === 7) spec.encoder.encode(spec.field, spec.value, buf, bufOffset)
    else spec.encoder.encode(spec.value, buf, bufOffset)
    bufOffset += spec.encoder.encode.bytes
  })
  return buf
}

function decodeRow ({ buf }) {
  const row = {}
  let bufLen = 0
  header.forEach(field => {
    const fieldSpec = userHeader.find(s => s.field === field)
    let encoder = enc.string
    if (fieldSpec?.encoding) {
      encoder = enc[fieldSpec.encoding]
    }
    let value
    if (encoder.type === 7) value = encoder.decode(field, buf, bufLen)
    else value = encoder.decode(buf, bufLen)
    row[field] = value
    bufLen += encoder.decode.bytes
  })
  return row
}

pipe(
  fs.createReadStream('test/redcedar-poi-nearest-by-period.csv'),
  csvStream,
  through.obj((row, enc, next) => {
    const buf = encodeRow({ row })
    next(null, buf)
  }),
  lps.encode(),
  fs.createWriteStream('encoded.lp'),
  (error) => {
    console.log(error)
    pipe(
      fs.createReadStream('encoded.lp'),
      lps.decode(),
      through((buf, enc, next) => {
        const row = decodeRow({ buf })
        console.log(row)
        next()
      }),
      (error) => {
        console.log(error)
      })
  }
)
