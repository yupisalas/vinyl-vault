import vinylCrescent from '../assets/figma/v2/vinyl-crescent.png'
import { coverGradient } from '../lib/palette'
import type { VinylRecord } from '../types'
import { IconHeart } from './icons'

interface Props {
  record: VinylRecord
  onClick?: () => void
}

function Cover({ record, roundedClass = 'rounded-[5.5%]' }: { record: VinylRecord; roundedClass?: string }) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${roundedClass}`}
      style={{
        background: record.coverImage ? `url(${record.coverImage}) center/cover no-repeat` : coverGradient(record.title),
        boxShadow: '0 6px 14px -4px rgba(30,10,40,0.4)',
      }}
    >
      {!record.coverImage && (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
          <span className="font-display text-white text-[11px] leading-tight drop-shadow">{record.title}</span>
        </div>
      )}
    </div>
  )
}

// Ported verbatim from the real Figma components "Tengo" (81:628) and
// "Quiero" (81:602), file FvDnp3X67U1ZT9drvGkLGD, page "componentes" — the
// centralized source of truth. Quiero was corrected to match Tengo's own
// 132px height exactly (container 122x132, cover starting 5px from the
// top), so both sit on the exact same base and read as the same size.
//
// The vinyl disc is a pre-cropped crescent asset (not a runtime CSS crop of
// the full circle) — WebKit on iOS wasn't reliably resolving a percentage
// width/height chain built on top of an aspect-ratio-derived flex-item
// size, and rendered the disc at its full intrinsic 350x350 instead.
// Baking the crop into the asset removes that whole dependency chain.
export default function RecordCard({ record, onClick }: Props) {
  if (record.status === 'want') {
    return (
      <button onClick={onClick} className="relative shrink-0 h-full" style={{ aspectRatio: '122 / 132' }}>
        <div className="absolute left-0" style={{ top: 5, width: '100%', aspectRatio: '1 / 1' }}>
          <Cover record={record} />
        </div>
        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
          <IconHeart className="w-3 h-3 text-white" />
        </span>
      </button>
    )
  }

  return (
    <button onClick={onClick} className="relative shrink-0 h-full" style={{ aspectRatio: '176.042 / 132' }}>
      <div className="absolute flex items-center" style={{ inset: '3.79% 30.57% 3.61% 0' }}>
        <Cover record={record} />
      </div>
      <img
        src={vinylCrescent}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{ left: '69.33%', right: 0, top: 0, bottom: 0, width: '30.67%', height: '100%', objectFit: 'cover' }}
        draggable={false}
      />
    </button>
  )
}
