import type { VinylRecord } from '../../types'
import RecordCardV2, { MARGIN_AFTER_WANT } from './RecordCardV2'

// Ported from the Figma "estante con discos" component (123:570): the shelf
// is a sandwich, same as the acrylic shelf's back/front split —
//   1. backplate (dark gradient) — renders BEHIND the records, only shows
//      through in the gaps between covers
//   2. records — sit on top of the backplate
//   3. front lip (light gradient) — renders IN FRONT of the records,
//      covering roughly the bottom 5px of each one
// The record has to go "inside" both layers, not just touch one edge.
const BACK_HEIGHT = 16
const FRONT_HEIGHT = 9
const FRONT_OVERLAP = 5
const RECORD_BOTTOM_PADDING = FRONT_HEIGHT - FRONT_OVERLAP

const BACK_GRADIENT = 'linear-gradient(88deg, #3c3b3b 0%, #353333 57.2%, #3e3b3b 100%)'
const FRONT_GRADIENT =
  'linear-gradient(88deg, rgb(105,105,105) 0%, rgb(176,174,174) 15.8%, rgb(114,114,114) 28.2%, rgb(177,177,177) 44%, rgb(105,105,105) 55.4%, rgb(177,177,177) 72.9%, rgb(105,105,105) 92.5%, rgb(207,207,207) 103%)'

function PlaceholderSlot({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="relative shrink-0"
      style={{
        width: 92,
        height: 92,
        marginRight: MARGIN_AFTER_WANT,
        borderRadius: '2px 3px 3px 1px',
        backgroundColor: 'rgba(190,185,175,0.1)',
        border: '1px solid rgba(239,217,181,0.16)',
        boxShadow: '-2px 2px 5px 1px rgba(0,0,0,0.26)',
      }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center font-mono"
        style={{ fontSize: 10, color: 'rgba(239,217,181,0.35)', letterSpacing: '-0.4px' }}
      >
        [agregar]
      </span>
    </button>
  )
}

interface Props {
  records: VinylRecord[]
  onSelect: (id: string) => void
  onAdd: () => void
  leftInset?: string
  minSlots?: number
}

export default function ShelfRowV2({ records, onSelect, onAdd, leftInset = '1rem', minSlots = 5 }: Props) {
  const placeholderCount = Math.max(0, minSlots - records.length)

  return (
    <div className="overflow-x-auto no-scrollbar" style={{ height: 110 }}>
      <div className="relative" style={{ width: 'max-content', minWidth: '100%', height: '100%' }}>
        <div
          className="absolute right-4 bottom-0 rounded-t-[3px] pointer-events-none"
          style={{ left: leftInset, height: BACK_HEIGHT, backgroundImage: BACK_GRADIENT }}
        />
        <div
          className="relative flex items-end pr-4 h-full"
          style={{ paddingLeft: `calc(${leftInset} + 12px)`, paddingBottom: RECORD_BOTTOM_PADDING }}
        >
          {records.map((r) => (
            <RecordCardV2 key={r.id} record={r} onClick={() => onSelect(r.id)} />
          ))}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <PlaceholderSlot key={`placeholder-${i}`} onAdd={onAdd} />
          ))}
        </div>
        <div
          className="absolute right-4 bottom-0 rounded-t-[3px] pointer-events-none"
          style={{ left: leftInset, height: FRONT_HEIGHT, backgroundImage: FRONT_GRADIENT }}
        />
      </div>
    </div>
  )
}
