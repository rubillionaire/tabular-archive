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
      encoder: 'float',
    },
    {
      field: `${name}-nfeat-period`,
      encoder: 'category',
    },
  ]
}).reduce((acc, curr) => acc.concat(curr), [])

export const header = [
  {
    field: '',
    encoder: 'int32',
  },
  {
    field: 'id',
    encoder: 'int32',
  },
  {
    field: 'latitude',
    encoder: 'geo'
  },
  {
    field: 'longitude',
    encoder: 'geo'
  },
  {
    field: 'reclassified.tree.canopy.symptoms',
    encoder: 'category',
  },
].concat(analysesHeaders)

export const idForRow = ({ row }) => {
  return parseInt(row.id)
}

export const idEncoder = 'int32'
