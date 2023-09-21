/*

inputs:
- filePath
- userHeader?
- userIdForRow?
- userIdEncoder?

internally:
- create headerRow
- write tmp encoded headerRow buffer
- read csv rows
  - write tmp encoded/compressed data rows buffer
  - write tmp encoded data ids buffer
- write tmp categories buffer
- assemble tmp buffers
  - fs.stats to get the length of each
    - use that to create the header that gives offets/lengths

the other way to make this api would be to expose a

GenericTabularArchiver
  .setHeader({ headerRow })
    - encode and write out tmp file
  .setIdFn({ idFn, idEncoder })
  .addDataRow({ row }) // call as many times as necessary
    - encode and write out tmp files
  .finalize()
    - encode and write out tmp categories buffer
    - aseemble buffers into a single file

CSV
- filePath
- userHeader?
- userIdForRow?
- userIdEncoder?

*/

