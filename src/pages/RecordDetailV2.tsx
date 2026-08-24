import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useVaultStore } from '../store'
import { coverGradient } from '../lib/palette'
import { findAlbumStory } from '../lib/wikipedia'
import vinylCrescent from '../assets/figma/v2/vinyl-crescent.png'
import roomBg from '../assets/homev2/room-bg.jpg'
import { IconArrowLeft, IconTrash, IconShare, IconHeart } from '../components/icons'

const COVER_SIZE = 193

export default function RecordDetailV2() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = useVaultStore((s) => s.records.find((r) => r.id === id))
  const removeRecord = useVaultStore((s) => s.removeRecord)
  const updateRecord = useVaultStore((s) => s.updateRecord)
  const markAsHave = useVaultStore((s) => s.markAsHave)

  const [shared, setShared] = useState(false)
  const [sideA, setSideA] = useState((record?.sideA ?? []).join('\n'))
  const [sideB, setSideB] = useState((record?.sideB ?? []).join('\n'))
  const [activeSide, setActiveSide] = useState<'A' | 'B'>('A')
  const [storyState, setStoryState] = useState<'idle' | 'loading' | 'done' | 'notfound' | 'error'>(
    record?.story ? 'done' : 'idle'
  )

  useEffect(() => {
    if (!record || record.story) return
    let cancelled = false
    setStoryState('loading')
    findAlbumStory(record.title, record.artist)
      .then((result) => {
        if (cancelled) return
        if (result) {
          updateRecord(record.id, { story: result.text, storySource: result.sourceUrl })
          setStoryState('done')
        } else {
          setStoryState('notfound')
        }
      })
      .catch(() => !cancelled && setStoryState('error'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id])

  function refetchStory() {
    if (!record) return
    setStoryState('loading')
    findAlbumStory(record.title, record.artist)
      .then((result) => {
        if (result) {
          updateRecord(record.id, { story: result.text, storySource: result.sourceUrl })
          setStoryState('done')
        } else {
          setStoryState('notfound')
        }
      })
      .catch(() => setStoryState('error'))
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-black text-white px-5 pt-6">
        <p className="text-sm text-white/50">Disco no encontrado.</p>
        <button onClick={() => navigate('/home-v2')} className="mt-3 text-sm underline">Volver</button>
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
    <div className="relative min-h-screen font-mono" style={{ backgroundColor: '#14171a' }}>
      <img
        src={roomBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: 'center bottom' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(20,23,26,0.15) 0%, rgba(20,23,26,0.5) 40%, rgba(20,23,26,0.82) 72%, rgba(20,23,26,0.95) 100%)' }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <IconArrowLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => {
            removeRecord(record.id)
            navigate('/home-v2')
          }}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-red-400"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </header>

      <main className="relative z-10 px-6 pb-10 text-white">
        <div className="w-full flex justify-center">
          <div className="relative" style={{ width: COVER_SIZE, height: COVER_SIZE }}>
            {!isWant && (
              <div
                className="absolute pointer-events-none"
                style={{ left: '76%', bottom: 0, width: '48%', height: '92%', backgroundImage: `url(${vinylCrescent})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
              />
            )}
            <div
              className="relative w-full h-full overflow-hidden shadow-xl"
              style={{ borderRadius: '2px 4px 4px 1px', background: record.coverImage ? `url(${record.coverImage}) center/cover no-repeat` : coverGradient(record.title) }}
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
          <h1 className="text-[15px] tracking-tight">{record.title}</h1>
          <p className="text-[12px] text-white/70">{record.artist}</p>
        </div>

        <div className="mt-4 flex gap-2 justify-center flex-wrap text-[9.5px]">
          <span className="px-3 py-1.5 rounded-full" style={{ backgroundColor: '#505050' }}>{record.category}</span>
          <span className="px-3 py-1.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#505050' }}>
            {isWant && <IconHeart className="w-2.5 h-2.5" />}
            {isWant ? 'Lo quiero' : 'Lo tengo'}
          </span>
        </div>

        {isWant && (
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => markAsHave(record.id)}
              className="flex-1 py-3 rounded-full bg-white text-black text-[12px] font-medium"
            >
              Ya lo tengo
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-full border border-white/25 text-[12px] font-medium flex items-center justify-center gap-1.5"
            >
              <IconShare className="w-4 h-4" />
              {shared ? 'Copiado' : 'Compartir'}
            </button>
          </div>
        )}

        <div className="mt-7">
          {(storyState === 'done' || storyState === 'notfound' || storyState === 'error') && (
            <div className="flex justify-end mb-1">
              <button onClick={refetchStory} className="text-[10px] text-white/40 underline">
                Buscar de nuevo
              </button>
            </div>
          )}
          <div className="text-[12px] leading-[20px] text-white/90">
            {storyState === 'loading' && <p className="text-white/40">Buscando la historia de este disco…</p>}
            {storyState === 'notfound' && <p className="text-white/40">No encontramos información de este disco todavía.</p>}
            {storyState === 'error' && <p className="text-white/40">Algo falló buscando la historia. Probá de nuevo.</p>}
            {storyState === 'done' && record.story && (
              <div>
                <p>{record.story}</p>
                {record.storySource && (
                  <a href={record.storySource} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-white/40 underline">
                    vía Wikipedia
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center gap-[59px]">
            <button
              onClick={() => setActiveSide('A')}
              className="text-[12px] tracking-tight"
              style={{ color: activeSide === 'A' ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
            >
              LADO A
            </button>
            <button
              onClick={() => setActiveSide('B')}
              className="text-[12px] tracking-tight"
              style={{ color: activeSide === 'B' ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
            >
              LADO B
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
              className="w-full mt-5 bg-transparent text-[12px] leading-[2.09] text-white outline-none resize-none placeholder:text-white/30"
            />
          ) : (
            <textarea
              key="B"
              value={sideB}
              onChange={(e) => setSideB(e.target.value)}
              onBlur={() => updateRecord(record.id, { sideB: sideB.split('\n').map((s) => s.trim()).filter(Boolean) })}
              placeholder={'Tema 1\nTema 2'}
              rows={6}
              className="w-full mt-5 bg-transparent text-[12px] leading-[2.09] text-white outline-none resize-none placeholder:text-white/30"
            />
          )}
        </div>
      </main>
    </div>
  )
}
