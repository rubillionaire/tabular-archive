export const matchingFields = [
    'period-all',
    'period-eph',
    'period-int',
    'period-min-eph',
    'period-min-int',
    'period-per',
    'period-unk',
  ].map(name => [`${name}-nfeat-id`, `${name}-nfeat-period`])
    .reduce((acc, curr) => acc.concat(curr), [])
