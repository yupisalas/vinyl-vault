const coverPalette = [
  ['#2b3a67', '#5c7cfa'],
  ['#7b2d43', '#d6607b'],
  ['#1f4d3d', '#57c98f'],
  ['#4a2545', '#a15fc4'],
  ['#3a2e1f', '#d8a24a'],
  ['#1c3a4a', '#4fb3c9'],
]

export function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function coverGradient(seed: string): string {
  const [from, to] = coverPalette[hashString(seed) % coverPalette.length]
  return `linear-gradient(150deg, ${from}, ${to})`
}
