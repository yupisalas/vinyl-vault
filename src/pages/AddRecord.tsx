import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVaultStore } from '../store'
import { IconArrowLeft, IconCamera } from '../components/icons'
import type { RecordStatus } from '../types'

export default function AddRecord() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addRecord = useVaultStore((s) => s.addRecord)
  const existingCategories = useVaultStore((s) =>
    Array.from(new Set(s.records.map((r) => r.category)))
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<string>('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [category, setCategory] = useState(existingCategories[0] ?? '')
  const [newCategory, setNewCategory] = useState('')
  const [status, setStatus] = useState<RecordStatus>(searchParams.get('status') === 'want' ? 'want' : 'have')

  const finalCategory = category === '__new__' ? newCategory.trim() : category

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!title.trim() || !artist.trim() || !finalCategory) return
    const id = addRecord({ title: title.trim(), artist: artist.trim(), category: finalCategory, coverImage: photo, status })
    navigate(`/record/${id}`)
  }

  const canSave = title.trim() && artist.trim() && finalCategory

  return (
    <div className="app-shell">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-black/10 bg-white/70 flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-display text-lg font-semibold">Añadir disco</h1>
      </header>

      <main className="px-5 space-y-5">
        <div className="flex gap-2">
          <button
            onClick={() => setStatus('have')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              status === 'have' ? 'bg-black text-white border-black' : 'bg-white/50 text-black/55 border-black/15'
            }`}
          >
            Lo tengo
          </button>
          <button
            onClick={() => setStatus('want')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              status === 'want' ? 'bg-black text-white border-black' : 'bg-white/50 text-black/55 border-black/15'
            }`}
          >
            Lo quiero
          </button>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square rounded-2xl border-2 border-dashed border-black/15 bg-white/60 flex flex-col items-center justify-center gap-2 overflow-hidden"
        >
          {photo ? (
            <img src={photo} alt="portada" className="w-full h-full object-cover" />
          ) : (
            <>
              <IconCamera className="w-8 h-8 text-black/40" />
              <span className="text-sm text-black/50">
                {status === 'have' ? 'Sacar foto de la portada' : 'Foto de portada (opcional)'}
              </span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-black/50">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Kind of Blue"
              className="w-full mt-1 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-black/50">Artista</label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Ej. Miles Davis"
              className="w-full mt-1 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-black/50">Categoría / estante</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30"
            >
              <option value="" disabled>Elegir categoría</option>
              {existingCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__new__">+ Nueva categoría</option>
            </select>
            {category === '__new__' && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="w-full mt-2 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30"
              />
            )}
          </div>
        </div>

        <button
          disabled={!canSave}
          onClick={handleSave}
          className="w-full py-3.5 rounded-full bg-vault-ink text-white font-medium disabled:opacity-30"
        >
          {status === 'have' ? 'Guardar en la colección' : 'Guardar en wishlist'}
        </button>
      </main>
    </div>
  )
}
