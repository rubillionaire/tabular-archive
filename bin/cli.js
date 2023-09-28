#!/usr/bin/env node
import argParse from 'minimist'
import { join } from 'path'
import { encode } from '../index.mjs'

const cwd = process.cwd()

const getRelativeFilePath = (p) => {
  return join(cwd, p)
}

const argv = argParse(process.argv.slice(2), {
  alias: {
    c: 'config',
    o: 'output',
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
if (!input || !output) {
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

-c is the node module that defines fields that configure the tabular-archive.

  for example a module that exports the following:

  export const header = [{ field, encoder }]
  export const idForRow = ({ row }) => row.id
  export const idEncoder = 'int32'

  see \`test/users-supplied/redcedar-config.mjs\` of this package for for an example.

-o is the output file that will tabular-archive will be written to. 
  `
}