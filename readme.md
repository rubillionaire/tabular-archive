# tabular-archive

A node.js module and CLI that encodes a CSV into a compressed archive, and a browser module for reading rows of data from the archive. Rows of data can be read out individually, or with a start and end range. If the encoding process is provided with a function to determine an ID value for each row, then rows can be read from the archive based on the ID of a row, and optionally with a surrounding page of rows.

Data values are encoded with the [`protocol-buffer-encodings`](https://github.com/mafintosh/protocol-buffers-encodings) module, and subsequently gzip'd with [`fflate`](https://github.com/101arrowz/fflate).

The motivation for this project was to support creating an HTML table of data without reading the entire CSV into memory. An expression of gratitude for the network and not using more than needed. A sentiment encountered while doing volunteer spatial analysis work for the [Open Redcedar Dieback Analyses](https://jmhulbert.github.io/open/redcedar/). This code powers the data fetching of the interactive data explorer of the [Distance to Waterways Analysis](https://jmhulbert.github.io/open/redcedar/analyses/distance-to-waterways/) that I produced. The source code of which lives [here](https://github.com/rubillionaire/open/tree/main/redcedar/analyses/distance-to-waterways/web-explorer).

### Install

`npm install tabular-archive`

### Usage

Write a configuration module that optionally includes `header`, `idForRow`, `idEncoder` that is reflective of the CSV to archive. Any fields not represnted in the `header` array will be encoded as a `string` type. The more fields that are defined, the more opportunities to compress the data.

```javascript
// ta-config.mjs
import { encoderTypes } from 'tabular-archive'

export const header = [
  {
    field: 'name',
    encoder: encoderTypes.string,
  },
  {
    field: 'age',
    encoder: encoderTypes.int32,
  },
  {
    field: 'memberId',
    encoder: encoderTypes.int64,
  },
  {
    field: 'activeMember',
    encoder: encoderTypes.bool,
  },
  {
    field: 'signUpDate',
    encoder: encoderTypes.date,
  },
  {
    field: 'astrologicalSign',
    encoder: encoderTypes.category,
  },
  {
    field: 'latitude',
    encoder: encoderTypes.geo,
  },
  {
    field: 'longitude',
    encoder: encoderTypes.geo,
  },
]

export const idForRow = ({ row }) => row.memberId
export const idEncoder = encoderTypes.int64
````

Run the CLI, referencing the `ta-config.mjs` file described above.

`tabular-archive data.csv -c ta-config.mjs -o encoded.ta`

This will use the configuration to encode the `data.csv` file into the `encoded.ta` file.

With an encoded file, you can write the following browser code to read out rows of data.

```javascript
import { decodeFetch as TADecoder } from 'tabular-archive'

const decoder = await TADecoder({ archiveFilePath })

const pageCount = 10
const startRowNumber = 0
const endRowNumber = pageCount - 1
for await (const { row, rowNumber } of decoder.getRowsBySequence({ startRowNumber, endRowNumber })) {
  console.log({ row })
}
```

It is also possible to decode rows of data from node.js using the filesystem interface.

```javascript
import { decodeFs as TADecoder } from 'tabular-archive'
```

If a `tabular-archive` was encoded with a row ID using the `idForRow` function and optionally the `idEncoder` string, then the archive can be queried using a row ID. This is useful for coordinating views of data.

```javascript
const pageCount = 10
for await (const { row, rowNumber } of decoder.getRowsByIdWithPage({ id, pageCount })) {
  console.log({ row })
}
```


### API

**[`index.mjs`](./index.mjs) exports a node.js interface:**

`await encode({ csvFilePath, userHeader, userIdForRow, userIdEncoder, archiveFilePath })`

The encode function will take a `csvFilePath` and produce a tabular-archive at the `archiveFilePath` location. `userHeader`, `userIdForRow` & `userIdEncoder` are optional.

`const decoder = await decodeFs({ arhiveFilePath })`

The <a name="decoder-object">decoder object</a> has the following shape.

```javascript
{
  rowCount : number,
  headerRow : [{ field : string, encoder : string }],
  categories : [category : string],
  getRowBySequence : async ({ rowNumber : number }) => { row },
  getRowsBySequence : async ({ startRowNumber: number, endRowNumber : number }) => yield { row, rowNumber },
  getRowById : async ({ id }) => { row, rowNumber },
  getRowsByIdWithPage : async ({ id, pageCount : number }) => yield { row, rowNumber },
}
```

<a name="decoder-custom-reader"></a>`const decoderCustomReader = decode({ readRange })`

`decode` can be used to configure the decoder with a custom `readRange` interface, other than the supplied node.js filesystem and fetch interface. `readRange` has the signature

```javascript
async ({ filePath : string, start : number, end : end, ranges : [{ start, end }] }) => buffer
```

It should be able to read a singluar range using `start` and `end` attributes, or multiple ranges using the `ranges` value.

The return value of the `decode` function is an async function that takes an object with `{ archiveFilePath }` that resolves a [decoder object](#decoder-object).

`encoderTypes` is an ojbect with keys for each of the encoder types that a `userHeader` can contain. These are listed in the CLI output by running `tabular-archive -h`.

**[`browser.mjs`](./browser.js) exports:**

`const decoder = await decodeFetch({ archiveFilePath })` returns a [decoder-object](#decoder-object) as defined above.

`const decoderCustomReader = decode({ readRange })` returns a [decoder with customer range reader](#decoder-custom-reader).


### Tests

`npm test`

The tests show how each module gets used and composed in a final tabular-archive. The [test/user-supplied/redcedar-config.mjs](./test/user-supplied/redcedar-config.mjs) file also shows how encoding can be configured.


### `tabular-archive` Spec

The archive contains a [header](./src/archive-header.mjs) that describes the shape of the archive and how it can be decoded. The header contains the following bytes of encoded data.

1. 'TabularArchive', the name of our file format
2. 1, the current version number
3. `headerRowtStart`, the start of the `headerRow` byte range
4. `headerRowEnd`, the end of the `headerRow` byte range
5. `categoriesStart`, the start of the `categories` byte range
6. `categoriesEnd`, the end of the `categories` byte range
7. `dataRowIdEncoderType`, the string that represents the encoder type used to encode `dataRowIds` values
8. `dataRowIdsStart`, the start of the `dataRowIds` byte range
9. `dataRowIdsEnd`, the end of the `dataRowIds` byte range
10. `dataRowLengthsStart`, the start of the `dataRowLengths` byte range
11. `dataRowLengthsEnd`, the end of the `dataRowLengths` byte range

The `headerRow` is a series of `field` and `encoder` values both stored as strings.

The `categories` are a series of `category` string values.

The `dataRowIdEncoderType` is a string that represents the encoder used for the `dataRowIds`. For example, 'int32'.

The `dataRowIds` are a series of values encoded using the `dataRowIdEncoderType`.

The `dataRowLengths` are a series of byte length values.

The data rows are stored with the lengths specified in `dataRowLengths`, starting at the byte offset defined as `dataRowLengthsEnd`.
