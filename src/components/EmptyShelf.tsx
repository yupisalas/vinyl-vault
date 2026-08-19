import { useNavigate } from 'react-router-dom'
import ShelfBack from './ShelfBack'
import ShelfFront from './ShelfFront'
import { IconPlus } from './icons'

// The empty state, built from the same two real components as a populated
// shelf (ShelfBack + ShelfFront) with just the "add" hint in between —
// exactly the composition the empty state should validate before any
// record art gets dropped in.
export default function EmptyShelf() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate('/add')} className="relative w-full block text-left" style={{ aspectRatio: '386 / 162' }}>
      <ShelfBack />

      <div className="absolute flex items-center justify-center gap-2 text-black/30" style={{ inset: '8.3% 3.77% 10.96% 2.11%' }}>
        <span className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center">
          <IconPlus className="w-4 h-4" />
        </span>
        <span className="text-sm font-medium">Añadir disco</span>
      </div>

      <ShelfFront />
    </button>
  )
}
