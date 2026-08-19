export type RecordStatus = 'have' | 'want'

export interface VinylRecord {
  id: string
  title: string
  artist: string
  coverImage: string
  category: string
  status: RecordStatus
  addedAt: string
  story?: string
  sideA?: string[]
  sideB?: string[]
}
