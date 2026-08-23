export interface DiscogsCandidate {
  id: number
  title: string
  year?: string
  thumb?: string
  format?: string[]
}

export interface DiscogsRelease {
  title: string
  artist: string
  coverImage: string
  sideA: string[]
  sideB: string[]
}

async function discogsFetch(path: string, token: string) {
  const url = new URL(`https://api.discogs.com${path}`)
  url.searchParams.set('token', token)
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'MiVinylVault/1.0 +https://yupisalas.github.io/vinyl-vault/' },
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Token de Discogs inválido.')
    if (res.status === 429) throw new Error('Discogs pidió esperar un poco (demasiadas búsquedas seguidas).')
    throw new Error(`Discogs respondió ${res.status}.`)
  }
  return res.json()
}

export async function searchByBarcode(barcode: string, token: string): Promise<DiscogsCandidate[]> {
  const data = await discogsFetch(`/database/search?barcode=${encodeURIComponent(barcode)}&type=release`, token)
  const results = (data.results ?? []) as any[]
  return results
    .filter((r) => r.format?.some((f: string) => /vinyl/i.test(f)) ?? true)
    .map((r) => ({ id: r.id, title: r.title, year: r.year, thumb: r.thumb, format: r.format }))
}

export async function searchByQuery(query: string, token: string): Promise<DiscogsCandidate[]> {
  const data = await discogsFetch(
    `/database/search?q=${encodeURIComponent(query)}&type=release&format=Vinyl`,
    token
  )
  const results = (data.results ?? []) as any[]
  return results.slice(0, 15).map((r) => ({ id: r.id, title: r.title, year: r.year, thumb: r.thumb, format: r.format }))
}

export async function getRelease(id: number, token: string): Promise<DiscogsRelease> {
  const data = await discogsFetch(`/releases/${id}`, token)
  const [artist, ...titleParts] = String(data.title ?? '').split(' - ')
  const title = titleParts.length ? titleParts.join(' - ') : data.title
  const artistName = data.artists_sort || data.artists?.[0]?.name || artist || 'Desconocido'

  const sideA: string[] = []
  const sideB: string[] = []
  for (const track of data.tracklist ?? []) {
    if (track.type_ && track.type_ !== 'track') continue
    const name = track.title?.trim()
    if (!name) continue
    const side = String(track.position ?? '').trim().toUpperCase()
    if (side.startsWith('A')) sideA.push(name)
    else sideB.push(name)
  }

  return {
    title: (title || data.title || '').trim(),
    artist: artistName.replace(/\s*\(\d+\)$/, '').trim(),
    coverImage: data.images?.[0]?.uri || data.images?.[0]?.resource_url || '',
    sideA,
    sideB,
  }
}
