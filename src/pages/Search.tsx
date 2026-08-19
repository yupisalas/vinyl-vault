import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVaultStore } from '../store'
import BottomNav from '../components/BottomNav'
import RecordCard from '../components/RecordCard'
import { IconArrowLeft, IconSearch } from '../components/icons'

export default function Search() {
  const navigate = useNavigate()
  const records = useVaultStore((s) => s.records)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return records
    return records.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    )
  }, [records, query])

  return (
    <div className="app-shell">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-black/10 bg-white/70 flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-display text-lg font-semibold">Buscar</h1>
      </header>

      <div className="px-5">
        <div className="flex items-center gap-2 bg-white/70 border border-black/10 rounded-full px-4 py-3">
          <IconSearch className="w-4 h-4 text-black/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Título, artista o categoría"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <main className="px-5 pt-5 pb-6">
        <p className="text-xs text-black/40 mb-3">{results.length} resultados</p>
        <div className="flex flex-wrap gap-x-6 gap-y-6">
          {results.map((record) => (
            <div key={record.id} style={{ height: 100 }}>
              <RecordCard record={record} onClick={() => navigate(`/record/${record.id}`)} />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
