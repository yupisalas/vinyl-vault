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
// Two WebKit/iOS workarounds baked in here:
// 1. The card is NOT itself the flex item. Safari doesn't reliably size a
//    flex item whose WIDTH comes from `aspect-ratio` + an explicit height —
//    it rendered arbitrarily huge. Wrapping it in a plain flex-item div
//    (height:100%, width:auto/content-based) and putting `aspect-ratio` on
//    a normal-flow child inside that div avoids the flex-item case
//    entirely (this is the well-supported "explicit height → derive
//    width" direction, just not as a direct flex child).
// 2. The vinyl disc is a pre-cropped crescent asset, not a runtime CSS
//    crop of the full circle — one less derived-size layer.
export default function RecordCard({ record, onClick }: Props) {
  if (record.status === 'want') {
    return (
      <div className="h-full shrink-0">
        <button onClick={onClick} className="relative block h-full" style={{ aspectRatio: '122 / 132' }}>
          <div className="absolute left-0" style={{ top: 5, width: '100%', aspectRatio: '1 / 1' }}>
            <Cover record={record} />
          </div>
          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
            <IconHeart className="w-3 h-3 text-white" />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="h-full shrink-0">
      <button onClick={onClick} className="relative block h-full" style={{ aspectRatio: '176.042 / 132' }}>
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
    </div>
  )
}
