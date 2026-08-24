import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVaultStore } from '../store'
import ShelfRowV2 from '../components/v2/ShelfRowV2'
import CategoryMenu from '../components/v2/CategoryMenu'
import roomBg from '../assets/homev2/room-bg.png'
import vinylIcon from '../assets/homev2/vinyl-icon.png'
import menuIcon from '../assets/homev2/menu.svg'
import type { RecordStatus, VinylRecord } from '../types'

type Filter = 'all' | RecordStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Mi coleccion' },
  { key: 'have', label: 'Los tengo' },
  { key: 'want', label: 'Los quiero' },
]

const ROWS = 4

function chunkIntoRows(records: VinylRecord[], rows: number) {
  const result: VinylRecord[][] = Array.from({ length: rows }, () => [])
  const base = Math.floor(records.length / rows)
  let remainder = records.length % rows
  let idx = 0
  for (let r = 0; r < rows; r++) {
    const count = base + (remainder > 0 ? 1 : 0)
    if (remainder > 0) remainder--
    result[r] = records.slice(idx, idx + count)
    idx += count
  }
  return result
}

export default function HomeV2() {
  const records = useVaultStore((s) => s.records)
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)

  const categories = useMemo(() => Array.from(new Set(records.map((r) => r.category))), [records])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? records : records.filter((r) => r.status === filter)
    if (activeCategories.size > 0) list = list.filter((r) => activeCategories.has(r.category))
    return list
  }, [records, filter, activeCategories])

  const rows = useMemo(() => chunkIntoRows(filtered, ROWS), [filtered])

  function toggleCategory(c: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      next.has(c) ? next.delete(c) : next.add(c)
      return next
    })
  }

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: '#1c211f', backgroundImage: `url(${roomBg})`, backgroundSize: '100% auto', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center' }}
    >
      <header className="relative px-4 pt-14 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative font-mono text-[14px] tracking-[-0.5px] whitespace-nowrap"
                style={{ color: filter === f.key ? '#fef3de' : '#837d74' }}
              >
                {f.label}
                {filter === f.key && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px]" style={{ backgroundColor: '#EFD9B5' }} />
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setMenuOpen((v) => !v)} className="p-1">
            <img src={menuIcon} alt="Filtrar por categoría" className="w-4 h-3.5" />
          </button>
        </div>
        <div className="h-px mt-3" style={{ backgroundColor: 'rgba(239,217,181,0.3)' }} />

        {menuOpen && (
          <CategoryMenu
            categories={categories}
            active={activeCategories}
            onToggle={toggleCategory}
            onClear={() => setActiveCategories(new Set())}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </header>

      <main className="flex-1 flex flex-col justify-center gap-1 pb-6">
        {rows.map((row, i) => (
          <ShelfRowV2 key={i} records={row} onSelect={(id) => navigate(`/record/${id}`)} onAdd={() => navigate('/add')} />
        ))}
      </main>

      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 h-[55px] px-6 rounded-full flex items-center gap-3 z-30"
        style={{ backgroundColor: 'rgba(217,217,217,0.25)', backdropFilter: 'blur(4px)' }}
      >
        <span className="font-mono text-[12.5px] text-white">Agregar disco</span>
        <img src={vinylIcon} alt="" className="w-[38px] h-[38px] rounded-full object-cover" />
      </button>
    </div>
  )
}
