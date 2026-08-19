import type { CSSProperties } from 'react'
import ledgeGlowImg from '../assets/figma/v2/ledgeglow.svg'

function Screw({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 18.2676 17.5212" className="absolute" style={style}>
      <circle cx="7.59" cy="9.93" r="7.59" fill="#9D9D9D" fillOpacity="0.4" />
      <circle cx="9.78" cy="8.08" r="7.59" fill="#1A1A1A" />
      <circle cx="10.68" cy="7.59" r="7.49" fill="url(#screwGradBack)" stroke="url(#screwStrokeBack)" strokeWidth="0.2" />
      <defs>
        <linearGradient id="screwGradBack" x1="12.19" y1="0.99" x2="8.19" y2="13.49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#858383" />
          <stop offset="1" stopColor="#3D3D3D" />
        </linearGradient>
        <linearGradient id="screwStrokeBack" x1="14.69" y1="-2.51" x2="5.19" y2="16.99" gradientUnits="userSpaceOnUse">
          <stop stopOpacity="0.15" />
          <stop offset="1" stopColor="#666666" stopOpacity="0.17" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Ported verbatim from the real Figma component "shelf trasero" (node
// 81:625, file FvDnp3X67U1ZT9drvGkLGD, page "componentes" — the centralized
// source of truth): the back panel + screws + the glass glow strip.
// Deliberately does NOT include the ledge lip or the tag — those live in
// ShelfFront and are rendered on top of whatever sits on this layer.
export default function ShelfBack() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute border-4 border-solid rounded-[11.93px]"
        style={{ background: 'rgba(214,197,219,0.45)', filter: 'blur(5.639px)', borderColor: 'rgba(80,53,104,0.24)', inset: '4.32% 2.07% 6.79% 4.4%' }}
      />
      <div
        className="absolute border-solid"
        style={{
          background: 'rgba(214,197,219,0.45)',
          borderWidth: '1.627px',
          borderColor: 'rgba(157,105,206,0.59)',
          inset: '0 3.77% 10.96% 2.11%',
          borderRadius: '11.93px 11.93px 4.338px 7.592px',
        }}
      />
      <Screw style={{ inset: '4.02% 91.43% 85.17% 3.84%' }} />
      <Screw style={{ inset: '4.02% 6.93% 85.17% 88.34%' }} />

      <div className="absolute pointer-events-none select-none" style={{ inset: '87.65% 0 0 2.07%' }}>
        <div className="absolute" style={{ inset: '-20% -0.32%' }}>
          <img src={ledgeGlowImg} alt="" className="block w-full h-full" draggable={false} />
        </div>
      </div>
    </div>
  )
}
