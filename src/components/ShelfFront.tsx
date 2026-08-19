import type { CSSProperties } from 'react'
import tapeImg from '../assets/figma/v2/tape.png'
import ledgeImg from '../assets/figma/v2/ledge.svg'
import ledgeLineImg from '../assets/figma/v2/ledgeline.svg'

interface Props {
  category?: string
}

// Ported verbatim from the real Figma component "shelf delantero" (node
// 81:633, file FvDnp3X67U1ZT9drvGkLGD, page "componentes" — the centralized
// source of truth). Native box is 375.239 x 94.151; that box sits inset
// left:0 / right:2.79% / top:42.47% / height:58.12% within the full
// 386x162 shelf canvas (matches ShelfBack's own ledge-glow inset exactly).
// Renders on top of whatever sits on ShelfBack (the records), covering
// their bottom edge — that's the whole point of splitting front/back.
export default function ShelfFront({ category }: Props) {
  return (
    <div className="absolute" style={{ left: 0, width: '97.21%', top: '42.47%', height: '58.12%' }}>
      <div className="absolute inset-0" style={{ containerType: 'inline-size' } as CSSProperties}>
        <div className="absolute pointer-events-none select-none" style={{ inset: '33.5% 0 19.27% 0' }}>
          <div className="absolute" style={{ inset: '-1.83% -0.22% -1.77% 2.31%' }}>
            <img src={ledgeImg} alt="" className="block w-full h-full" draggable={false} />
          </div>
        </div>
        <div className="absolute pointer-events-none select-none" style={{ inset: '65.75% 0 34.25% 3.18%' }}>
          <div className="absolute" style={{ inset: '-1.03px 0' }}>
            <img src={ledgeLineImg} alt="" className="block w-full h-full" draggable={false} />
          </div>
        </div>

        <div className="absolute z-20" style={{ left: '6.4%', width: '31.5%', top: 0, aspectRatio: '118.214 / 94.151', containerType: 'size' } as CSSProperties}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex-none"
              style={{ height: 'hypot(19.497cqw, 55.0604cqh)', width: 'hypot(80.503cqw, -44.9396cqh)', transform: 'rotate(-23.97deg)' } as CSSProperties}
            >
              <img src={tapeImg} alt="" className="block w-full h-full object-contain pointer-events-none select-none" draggable={false} />
            </div>
          </div>
          {category && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <span
                className="text-black whitespace-nowrap uppercase"
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'min(15cqw, 15px)', letterSpacing: '0.02em', transform: 'rotate(-2.99deg)' } as CSSProperties}
              >
                {category}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
