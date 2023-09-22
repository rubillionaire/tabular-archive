export const RandomSampler = ({ sampleLength, sampleSize=5 }) => {
  let counter = -1
  const randomInRange = () => Math.floor(Math.random() * sampleLength)
  // const positions = Array.from({ length: sampleSize }, () => randomInRange())
  const positions = Array.from({ length: 1 }, () => 0)
  const sample = []

  return {
    save: (value) => {
      counter += 1
      if (positions.indexOf(counter) === -1) return
      sample.push({
        index: counter,
        value: { ...value },
      })
    },
    sample,
  }
}
