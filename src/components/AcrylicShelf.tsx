import type { ReactNode } from 'react'
import ShelfBack from './ShelfBack'
import ShelfFront from './ShelfFront'

interface Props {
  category: string
  children: ReactNode[]
}

// The shelf is literally two Figma components stacked: ShelfBack (panel +
// screws) behind, ShelfFront (ledge + tag) in front — with the records
// sandwiched in between, so the front layer covers their bottom edge.
export default function AcrylicShelf({ category, children }: Props) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '386 / 162' }}>
      <ShelfBack />

      {/* top offset gets a fixed +5px on top of the panel's own inset — a small
          air gap so the records read as standing forward of the acrylic, not
          glued flat against it (perspective cue) */}
      {/* bottom-aligned: both cards' bases rest on the same line, matching
          Tengo's own bottom edge (the reference) */}
      <div className="absolute flex items-end justify-center gap-2" style={{ inset: 'calc(8.3% + 5px) 3.77% 10.96% 2.11%' }}>
        {children}
      </div>

      <ShelfFront category={category} />
    </div>
  )
}
