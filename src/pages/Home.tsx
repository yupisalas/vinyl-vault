import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVaultStore } from '../store'
import AcrylicShelf from '../components/AcrylicShelf'
import EmptyShelf from '../components/EmptyShelf'
import RecordCard from '../components/RecordCard'
import BottomNav from '../components/BottomNav'
import { IconPlus } from '../components/icons'
import type { RecordStatus, VinylRecord } from '../types'

type Filter = 'all' | RecordStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Colección' },
  { key: 'have', label: 'Tengo' },
  { key: 'want', label: 'Quiero' },
]

export default function Home() {
  const records = useVaultStore((s) => s.records)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialFilter = (searchParams.get('filter') as Filter) ?? 'all'
  const [filter, setFilter] = useState<Filter>(FILTERS.some((f) => f.key === initialFilter) ? initialFilter : 'all')

  useEffect(() => {
    const f = searchParams.get('filter') as Filter
    if (FILTERS.some((x) => x.key === f)) setFilter(f)
  }, [searchParams])

  const filtered = useMemo(
    () => (filter === 'all' ? records : records.filter((r) => r.status === filter)),
    [records, filter]
  )

  const shelves = useMemo(() => {
    const byCategory = new Map<string, VinylRecord[]>()
    filtered.forEach((r) => {
      const list = byCategory.get(r.category) ?? []
      list.push(r)
      byCategory.set(r.category, list)
    })
    const result: { category: string; records: VinylRecord[] }[] = []
    byCategory.forEach((list, category) => {
      for (let i = 0; i < list.length; i += 2) {
        result.push({ category, records: list.slice(i, i + 2) })
      }
    })
    return result
  }, [filtered])

  return (
    <div className="app-shell">
      <header className="px-6 pt-6 pb-3">
        <p className="font-mono text-[13px] tracking-tight text-black">Mi coleccion</p>
        <div className="relative mt-1.5 h-[2px] w-full">
          <div className="absolute inset-0 bg-[#C9C9C9]" />
          <div className="absolute left-0 top-0 h-full w-[100px] bg-[#3D3D3D]" />
        </div>

        <div className="flex gap-2 mt-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                filter === f.key
                  ? 'bg-black text-white border-black'
                  : 'bg-white/50 text-black/55 border-black/15'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 pt-3 flex flex-col" style={{ gap: 50 }}>
        {shelves.length === 0 && filter !== 'all' && (
          <p className="text-sm text-black/40 py-6 text-center">
            {filter === 'have' ? 'Todavía no marcaste ningún disco como tuyo.' : 'Tu wishlist está vacía.'}
          </p>
        )}
        {shelves.map((shelf, i) => (
          <AcrylicShelf key={i} category={shelf.category}>
            {shelf.records.map((record) => (
              <RecordCard key={record.id} record={record} onClick={() => navigate(`/record/${record.id}`)} />
            ))}
          </AcrylicShelf>
        ))}
        <EmptyShelf />
      </main>

      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[62px] h-[62px] rounded-full bg-black shadow-xl z-30 flex items-center justify-center"
      >
        <span
          className="absolute w-[22px] h-[22px] rounded-[11px]"
          style={{ background: 'linear-gradient(180deg, rgba(125,57,140,0.93), rgba(137,92,133,0.93))' }}
        />
        <IconPlus className="w-4 h-4 text-white relative z-10" />
      </button>

      <BottomNav />
    </div>
  )
}
