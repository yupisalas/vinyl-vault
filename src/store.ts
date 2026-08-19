import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { VinylRecord } from './types'
import darkSide from './assets/covers/dark-side.png'
import petSounds from './assets/covers/pet-sounds.png'
import letItBleed from './assets/covers/let-it-bleed.png'
import pappos4 from './assets/covers/pappos-blues-4.png'
import pappos6 from './assets/covers/pappos-blues-6.png'
import modernClix from './assets/covers/modern-clix.png'

const seedRecords: VinylRecord[] = [
  {
    id: uuid(),
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    coverImage: darkSide,
    category: 'Rock',
    status: 'have',
    addedAt: '2026-01-04',
    story: 'Comprado en una disquería de barrio un domingo lluvioso. El vendedor juró que era la mejor edición prensada de la década.',
    sideA: ['Speak to Me', 'Breathe', 'On the Run', 'Time', 'The Great Gig in the Sky'],
    sideB: ['Money', 'Us and Them', 'Any Colour You Like', 'Brain Damage', 'Eclipse'],
  },
  { id: uuid(), title: 'Pet Sounds', artist: 'The Beach Boys', coverImage: petSounds, category: 'Rock', status: 'have', addedAt: '2026-01-11' },
  { id: uuid(), title: 'Let It Bleed', artist: 'The Rolling Stones', coverImage: letItBleed, category: 'Rock', status: 'have', addedAt: '2026-02-02' },
  { id: uuid(), title: 'Volumen 4', artist: "Pappo's Blues", coverImage: pappos4, category: 'Nacional', status: 'have', addedAt: '2026-02-18' },
  { id: uuid(), title: 'Volumen 6', artist: "Pappo's Blues", coverImage: pappos6, category: 'Nacional', status: 'want', addedAt: '2026-03-01' },
  { id: uuid(), title: 'Modern Clix', artist: 'Desconocido', coverImage: modernClix, category: 'Punk', status: 'have', addedAt: '2026-03-09' },
  { id: uuid(), title: 'Slow Amber', artist: 'Reina Voss', coverImage: '', category: 'Nacional', status: 'have', addedAt: '2026-03-22' },
  { id: uuid(), title: 'Low Tide', artist: 'Coastal Drift', coverImage: '', category: 'Punk', status: 'have', addedAt: '2026-04-02' },
  { id: uuid(), title: 'Glass Fields', artist: 'Mira Solene', coverImage: '', category: 'Rock', status: 'want', addedAt: '2026-04-15' },
]

interface VaultState {
  records: VinylRecord[]
  discogsToken: string
  addRecord: (record: Omit<VinylRecord, 'id' | 'addedAt'>) => string
  updateRecord: (id: string, patch: Partial<Omit<VinylRecord, 'id'>>) => void
  removeRecord: (id: string) => void
  markAsHave: (id: string) => void
  setDiscogsToken: (token: string) => void
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      records: seedRecords,
      discogsToken: '',
      setDiscogsToken: (token) => set({ discogsToken: token.trim() }),
      addRecord: (record) => {
        const id = uuid()
        set((state) => ({
          records: [{ ...record, id, addedAt: new Date().toISOString() }, ...state.records],
        }))
        return id
      },
      updateRecord: (id, patch) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeRecord: (id) =>
        set((state) => ({ records: state.records.filter((r) => r.id !== id) })),
      markAsHave: (id) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, status: 'have' } : r)),
        })),
    }),
    {
      name: 'vinyl-vault-storage',
      version: 3,
      migrate: (persisted) => {
        const state = persisted as { records?: VinylRecord[] }
        const records = (state?.records ?? []).map((r) => ({ ...r, status: r.status ?? 'have' }))
        return { records }
      },
    }
  )
)
