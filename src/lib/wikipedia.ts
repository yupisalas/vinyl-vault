export interface AlbumStory {
  text: string
  sourceUrl: string
}

async function searchPageTitle(lang: 'es' | 'en', title: string, artist: string): Promise<string | null> {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=3&srsearch=${encodeURIComponent(
    `${title} ${artist}`
  )}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const first = data?.query?.search?.[0]
  return first?.title ?? null
}

async function fetchSummary(lang: 'es' | 'en', pageTitle: string): Promise<AlbumStory | null> {
  const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.type === 'disambiguation' || !data.extract) return null
  return { text: data.extract as string, sourceUrl: data.content_urls?.desktop?.page ?? '' }
}

export async function findAlbumStory(title: string, artist: string): Promise<AlbumStory | null> {
  for (const lang of ['es', 'en'] as const) {
    const pageTitle = await searchPageTitle(lang, title, artist)
    if (!pageTitle) continue
    const summary = await fetchSummary(lang, pageTitle)
    if (!summary) continue
    const mentionsArtist = summary.text.toLowerCase().includes(artist.toLowerCase().split(' ')[0])
    if (!mentionsArtist) continue
    return summary
  }
  return null
}
