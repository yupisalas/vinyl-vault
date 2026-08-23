import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useVaultStore } from '../store'
import { coverGradient } from '../lib/palette'
import vinylImg from '../assets/figma/v2/vinyl.png'
import { IconArrowLeft, IconTrash, IconShare, IconHeart } from '../components/icons'

const CONTAINER_RATIO = 153.191 / 132
const COVER_TOP_PCT = (4.5 / 132) * 100
const COVER_HEIGHT_PCT = (122.232 / 132) * 100
const VINYL_LEFT_PCT = (21.19 / 153.191) * 100

export default function RecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = useVaultStore((s) => s.records.find((r) => r.id === id))
  const removeRecord = useVaultStore((s) => s.removeRecord)
  const updateRecord = useVaultStore((s) => s.updateRecord)
  const markAsHave = useVaultStore((s) => s.markAsHave)

  const [shared, setShared] = useState(false)
  const [story, setStory] = useState(record?.story ?? '')
  const [sideA, setSideA] = useState((record?.sideA ?? []).join('\n'))
  const [sideB, setSideB] = useState((record?.sideB ?? []).join('\n'))
  const [activeSide, setActiveSide] = useState<'A' | 'B'>('A')

  if (!record) {
    return (
      <div className="app-shell px-5 pt-6">
        <p className="text-sm text-black/50">Disco no encontrado.</p>
        <button onClick={() => navigate('/')} className="mt-3 text-sm underline">Volver</button>
      </div>
    )
  }

  const isWant = record.status === 'want'

  async function handleShare() {
    if (!record) return
    const text = `Quiero: ${record.title} - ${record.artist} 🎵`
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <div className="app-shell">
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-black/10 bg-white/70 flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            removeRecord(record.id)
            navigate('/')
          }}
          className="w-9 h-9 rounded-full border border-black/10 bg-white/70 flex items-center justify-center text-red-500"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </header>

      <main className="px-6 pb-6">
        <div className="w-full flex justify-center">
          <div
            className="relative"
            style={{ width: '82%', aspectRatio: isWant ? '1 / 1' : `${CONTAINER_RATIO}` }}
          >
            {!isWant && (
              <div
                className="absolute rounded-full overflow-hidden"
                style={{ left: `${VINYL_LEFT_PCT}%`, top: 0, height: '100%', aspectRatio: '1 / 1' }}
              >
                <img src={vinylImg} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className="absolute left-0 rounded-xl overflow-hidden z-10 shadow-xl"
              style={{
                top: isWant ? 0 : `${COVER_TOP_PCT}%`,
                height: isWant ? '100%' : `${COVER_HEIGHT_PCT}%`,
                aspectRatio: '1 / 1',
                background: record.coverImage ? `url(${record.coverImage}) center/cover no-repeat` : coverGradient(record.title),
              }}
            >
              {!record.coverImage && (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <span className="font-display text-white text-xl">{record.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-1 text-center">
          <h1 className="font-display text-2xl font-semibold">{record.title}</h1>
          <p className="text-black/55">{record.artist}</p>
        </div>

        <div className="mt-5 flex gap-2 justify-center flex-wrap">
          <span className="text-xs font-medium bg-vault-bg2 px-3 py-1.5 rounded-full">{record.category}</span>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${isWant ? 'bg-pink-100 text-pink-700' : 'bg-lime-100 text-lime-800'}`}>
            {isWant && <IconHeart className="w-3 h-3" />}
            {isWant ? 'Quiero' : 'Tengo'}
          </span>
          <span className="text-xs font-medium text-black/40 px-3 py-1.5">
            {new Date(record.addedAt).toLocaleDateString('es-ES')}
          </span>
        </div>

        {isWant && (
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => markAsHave(record.id)}
              className="flex-1 py-3 rounded-full bg-vault-ink text-white text-sm font-medium"
            >
              Ya lo tengo
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-full border border-black/15 text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <IconShare className="w-4 h-4" />
              {shared ? 'Copiado' : 'Compartir'}
            </button>
          </div>
        )}

        <div className="mt-7">
          <label className="text-xs font-medium text-black/50">Mini historia</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            onBlur={() => updateRecord(record.id, { story })}
            placeholder="Contá algo sobre este disco: dónde lo conseguiste, qué te recuerda..."
            rows={3}
            className="w-full mt-1.5 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30 resize-none"
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setActiveSide('A')}
              className={`font-display font-semibold transition-all ${
                activeSide === 'A' ? 'text-xl text-vault-ink' : 'text-sm text-black/35'
              }`}
            >
              Lado A
            </button>
            <button
              onClick={() => setActiveSide('B')}
              className={`font-display font-semibold transition-all ${
                activeSide === 'B' ? 'text-xl text-vault-ink' : 'text-sm text-black/35'
              }`}
            >
              Lado B
            </button>
          </div>
          {activeSide === 'A' ? (
            <textarea
              key="A"
              value={sideA}
              onChange={(e) => setSideA(e.target.value)}
              onBlur={() => updateRecord(record.id, { sideA: sideA.split('\n').map((s) => s.trim()).filter(Boolean) })}
              placeholder={'Tema 1\nTema 2'}
              rows={6}
              className="w-full mt-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30 resize-none"
            />
          ) : (
            <textarea
              key="B"
              value={sideB}
              onChange={(e) => setSideB(e.target.value)}
              onBlur={() => updateRecord(record.id, { sideB: sideB.split('\n').map((s) => s.trim()).filter(Boolean) })}
              placeholder={'Tema 1\nTema 2'}
              rows={6}
              className="w-full mt-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/30 resize-none"
            />
          )}
        </div>
      </main>
    </div>
  )
}
