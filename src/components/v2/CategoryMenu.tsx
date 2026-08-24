import { useNavigate } from 'react-router-dom'

interface Props {
  categories: string[]
  active: Set<string>
  onToggle: (category: string) => void
  onClear: () => void
  onClose: () => void
}

export default function CategoryMenu({ categories, active, onToggle, onClear, onClose }: Props) {
  const navigate = useNavigate()

  return (
    <div className="absolute inset-x-0 top-full z-20 mx-4 mt-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[12px] text-[#EFD9B5]">Filtrar por categoría</p>
        <button onClick={onClose} className="text-white/50 text-[12px] font-mono">
          cerrar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onClear}
          className={`px-3 py-1.5 rounded-full text-[12px] font-mono border transition-colors ${
            active.size === 0 ? 'bg-[#EFD9B5] text-black border-[#EFD9B5]' : 'text-white/60 border-white/20'
          }`}
        >
          todas
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onToggle(c)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-mono border transition-colors ${
              active.has(c) ? 'bg-[#EFD9B5] text-black border-[#EFD9B5]' : 'text-white/60 border-white/20'
            }`}
          >
            {c.toLowerCase()}
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-4 text-[11px] font-mono text-white/35 underline"
      >
        ver diseño clásico
      </button>
    </div>
  )
}
