const floatWithinMargin = (margin=0.01) => (af, bf) => {
  return Math.abs(af-bf) <= margin
}
export const matchingFields = ({ t, headerRow, msgPrefix='' }) => (a, b) => {
  const floatMarginTest = floatWithinMargin(0.01)
  for (const { field, encoder } of headerRow) {
    const testMsg = `${msgPrefix} field ${field} of encoder ${encoder} is equal.`
    if (encoder === 'float' || encoder === 'geo') {
      t.ok(floatMarginTest(a[field], b[field]), testMsg)
    }
    else if (encoder === 'date') {
      t.ok(new Date(a[field]).getTime(), new Date(b[field]).getTime(), testMsg)
    }
    else if (encoder === 'int32') {
      t.ok(+a[field], +b[field], testMsg)
    }
    else {
      t.ok(a[field] === b[field], testMsg)
    }
  }
}