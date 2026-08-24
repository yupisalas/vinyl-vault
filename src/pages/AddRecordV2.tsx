import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVaultStore } from '../store'
import { searchByBarcode, searchByQuery, getRelease, type DiscogsCandidate } from '../lib/discogs'
import BarcodeScanner from '../components/BarcodeScanner'
import addBg from '../assets/homev2/add-bg.jpg'
import { IconArrowLeft, IconCamera, IconBarcode } from '../components/icons'
import type { RecordStatus } from '../types'

export default function AddRecordV2() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addRecord = useVaultStore((s) => s.addRecord)
  const discogsToken = useVaultStore((s) => s.discogsToken)
  const setDiscogsToken = useVaultStore((s) => s.setDiscogsToken)
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
  const [sideA, setSideA] = useState<string[]>([])
  const [sideB, setSideB] = useState<string[]>([])

  const [tokenDraft, setTokenDraft] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState('')
  const [queryInput, setQueryInput] = useState('')
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [lookupError, setLookupError] = useState('')
  const [candidates, setCandidates] = useState<DiscogsCandidate[] | null>(null)

  const finalCategory = category === '__new__' ? newCategory.trim() : category
  const inputClass =
    'flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[12px] text-white placeholder:text-white/35 outline-none focus:border-white/35'

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  function applyRelease(r: { title: string; artist: string; coverImage: string; sideA: string[]; sideB: string[] }) {
    setTitle(r.title)
    setArtist(r.artist)
    if (r.coverImage) setPhoto(r.coverImage)
    setSideA(r.sideA)
    setSideB(r.sideB)
    setCandidates(null)
    setLookupState('idle')
  }

  async function runLookup(term: string, mode: 'barcode' | 'query') {
    if (!term.trim()) return
    if (!discogsToken) return
    setLookupState('loading')
    setLookupError('')
    setCandidates(null)
    try {
      const results = mode === 'barcode'
        ? await searchByBarcode(term.trim(), discogsToken)
        : await searchByQuery(term.trim(), discogsToken)
      if (results.length === 0) {
        setLookupState('error')
        setLookupError('No encontramos nada en Discogs con eso.')
        return
      }
      if (results.length === 1) {
        const release = await getRelease(results[0].id, discogsToken)
        applyRelease(release)
      } else {
        setCandidates(results)
        setLookupState('idle')
      }
    } catch (err) {
      setLookupState('error')
      setLookupError(err instanceof Error ? err.message : 'Algo falló buscando en Discogs.')
    }
  }

  async function pickCandidate(c: DiscogsCandidate) {
    if (!discogsToken) return
    setLookupState('loading')
    try {
      const release = await getRelease(c.id, discogsToken)
      applyRelease(release)
    } catch (err) {
      setLookupState('error')
      setLookupError(err instanceof Error ? err.message : 'Algo falló buscando en Discogs.')
    }
  }

  function handleSave() {
    if (!title.trim() || !artist.trim() || !finalCategory) return
    const id = addRecord({
      title: title.trim(),
      artist: artist.trim(),
      category: finalCategory,
      coverImage: photo,
      status,
      sideA: sideA.length ? sideA : undefined,
      sideB: sideB.length ? sideB : undefined,
    })
    navigate(`/v2/record/${id}`)
  }

  const canSave = title.trim() && artist.trim() && finalCategory

  return (
    <div className="relative min-h-screen font-mono" style={{ backgroundColor: '#14171a' }}>
      <img
        src={addBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: 'center bottom' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(20,23,26,0.35) 0%, rgba(20,23,26,0.6) 35%, rgba(20,23,26,0.88) 70%, rgba(20,23,26,0.96) 100%)' }}
      />

      <header className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-[15px] text-white tracking-tight">Añadir disco</h1>
      </header>

      <main className="relative z-10 px-5 space-y-5 pb-10 text-white">
        <div className="flex gap-2">
          <button
            onClick={() => setStatus('have')}
            className="flex-1 py-2.5 rounded-full text-[12px] transition-colors"
            style={status === 'have' ? { backgroundColor: '#fff', color: '#000' } : { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Lo tengo
          </button>
          <button
            onClick={() => setStatus('want')}
            className="flex-1 py-2.5 rounded-full text-[12px] transition-colors"
            style={status === 'want' ? { backgroundColor: '#fff', color: '#000' } : { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Lo quiero
          </button>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm p-4 space-y-3">
          <p className="text-[11px] text-white/50">Buscar en Discogs</p>

          {!discogsToken ? (
            <div className="space-y-2">
              <p className="text-[11px] text-white/45 leading-snug">
                Necesitás un token personal gratuito de Discogs. Lo generás en discogs.com → Settings → Developers → Generate new token, y lo pegás acá. Se guarda solo en este dispositivo.
              </p>
              <div className="flex gap-2">
                <input
                  value={tokenDraft}
                  onChange={(e) => setTokenDraft(e.target.value)}
                  placeholder="Pegá tu token de Discogs"
                  className={inputClass}
                />
                <button
                  onClick={() => setDiscogsToken(tokenDraft)}
                  disabled={!tokenDraft.trim()}
                  className="px-4 rounded-xl bg-white text-black text-[12px] font-medium disabled:opacity-30"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runLookup(barcodeInput, 'barcode')}
                  inputMode="numeric"
                  placeholder="Código de barras (UPC/EAN)"
                  className={inputClass}
                />
                <button
                  onClick={() => runLookup(barcodeInput, 'barcode')}
                  disabled={!barcodeInput.trim() || lookupState === 'loading'}
                  className="px-4 rounded-xl bg-white text-black text-[12px] font-medium disabled:opacity-30"
                >
                  Buscar
                </button>
              </div>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-2.5 rounded-xl border border-white/20 text-[12px] flex items-center justify-center gap-2"
              >
                <IconBarcode className="w-4 h-4" />
                Escanear con la cámara
              </button>

              <div className="flex items-center gap-2 pt-1">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-[10px] text-white/35">o por título / artista</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>
              <div className="flex gap-2">
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runLookup(queryInput, 'query')}
                  placeholder="Ej. Kind of Blue Miles Davis"
                  className={inputClass}
                />
                <button
                  onClick={() => runLookup(queryInput, 'query')}
                  disabled={!queryInput.trim() || lookupState === 'loading'}
                  className="px-4 rounded-xl bg-white text-black text-[12px] font-medium disabled:opacity-30"
                >
                  Buscar
                </button>
              </div>

              {lookupState === 'loading' && <p className="text-[11px] text-white/45">Buscando en Discogs…</p>}
              {lookupState === 'error' && <p className="text-[11px] text-red-400">{lookupError}</p>}
              {candidates && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-white/45">Encontramos varias ediciones, elegí la tuya:</p>
                  {candidates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => pickCandidate(c)}
                      className="w-full flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left"
                    >
                      {c.thumb ? (
                        <img src={c.thumb} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-white/10 shrink-0" />
                      )}
                      <span className="text-[11px] leading-snug">
                        {c.title} {c.year ? `(${c.year})` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square rounded-2xl border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-2 overflow-hidden"
        >
          {photo ? (
            <img src={photo} alt="portada" className="w-full h-full object-cover" />
          ) : (
            <>
              <IconCamera className="w-8 h-8 text-white/40" />
              <span className="text-[12px] text-white/50">
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
            <label className="text-[11px] text-white/50">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Kind of Blue"
              className="w-full mt-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[12px] text-white placeholder:text-white/35 outline-none focus:border-white/35"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/50">Artista</label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Ej. Miles Davis"
              className="w-full mt-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[12px] text-white placeholder:text-white/35 outline-none focus:border-white/35"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/50">Categoría / estante</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[12px] text-white outline-none focus:border-white/35"
            >
              <option value="" disabled className="text-black">Elegir categoría</option>
              {existingCategories.map((c) => (
                <option key={c} value={c} className="text-black">{c}</option>
              ))}
              <option value="__new__" className="text-black">+ Nueva categoría</option>
            </select>
            {category === '__new__' && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="w-full mt-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[12px] text-white placeholder:text-white/35 outline-none focus:border-white/35"
              />
            )}
          </div>

          {(sideA.length > 0 || sideB.length > 0) && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-white/50">Lado A</label>
                <div className="mt-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[11px] space-y-0.5 max-h-32 overflow-y-auto">
                  {sideA.map((t, i) => <p key={i}>{t}</p>)}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-white/50">Lado B</label>
                <div className="mt-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[11px] space-y-0.5 max-h-32 overflow-y-auto">
                  {sideB.map((t, i) => <p key={i}>{t}</p>)}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          disabled={!canSave}
          onClick={handleSave}
          className="w-full py-3.5 rounded-full bg-white text-black text-[13px] font-medium disabled:opacity-30"
        >
          {status === 'have' ? 'Guardar en la colección' : 'Guardar en wishlist'}
        </button>
      </main>

      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onDetect={(code) => {
            setShowScanner(false)
            setBarcodeInput(code)
            runLookup(code, 'barcode')
          }}
        />
      )}
    </div>
  )
}
