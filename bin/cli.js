#!/usr/bin/env node
import argParse from 'minimist'
import { join } from 'path'
import { encode, encoderTypes } from '../index.mjs'

const cwd = process.cwd()

const getRelativeFilePath = (p) => {
  return join(cwd, p)
}

const argv = argParse(process.argv.slice(2), {
  alias: {
    c: 'config',
    o: 'output',
    h: 'help'
  },
})

let userHeader
let userIdForRow
let userIdEncoder
if (argv.config) {
  const configPath = getRelativeFilePath(argv.config)
  const userConfig = await import(configPath)
  if (userConfig.header) {
    userHeader = userConfig.header
  }
  if (typeof userConfig.idForRow === 'function') {
    userIdForRow = userConfig.idForRow
  }
  if (userConfig.idEncoder) {
    userIdEncoder = userConfig.idEncoder
  }
}

const input = argv._[0]
const output = argv.output
if (!input || !output || argv.help) {
  console.log(help())
  process.exit(0)
}
const csvFilePath = getRelativeFilePath(input)
const archiveFilePath = getRelativeFilePath(output)

const opts = {
  csvFilePath,
  archiveFilePath,
}

if (userHeader) opts.userHeader = userHeader
if (userIdForRow) opts.userIdForRow = userIdForRow
if (userIdEncoder) opts.userIdEncoder = userIdEncoder

await encode(opts)

function help () {
  return `
tabular-archive example usage:

tabular-archive data.csv -c config.mjs -o encoded.ta

The first argument is the input CSV file to turn into a tabular-archive.

-c, --config is the node module that defines fields that configure the tabular-archive.

  for example a module that exports the following:

  export const header = [{ field, encoder }]
  export const idForRow = ({ row }) => row.id
  export const idEncoder = 'int32'

  see \`test/users-supplied/redcedar-config.mjs\` of this package for for an example.

  This is a complete list of encoder types: ${ Object.keys(encoderTypes).map(type => encoderTypes[type]).join(', ') }

-o, --output is the output file that will tabular-archive will be written to. 

-h, --help to see this message.
`
}