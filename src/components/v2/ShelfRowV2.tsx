import type { VinylRecord } from '../../types'
import RecordCardV2 from './RecordCardV2'

// Ported from the Figma "shelf" component (123:516): a shelf edge is two
// stacked gradient bars, not one — a darker front-face band (the visible
// underside/thickness of the plank) with a lighter top-surface highlight
// band overlapping its lower portion. Together they read as a plank with
// real depth instead of a flat painted line.
const PLANK_HEIGHT = 15
const FRONT_FACE_GRADIENT =
  'linear-gradient(88deg, #3c3b3b 0%, #353333 57.2%, #3e3b3b 100%)'
const TOP_HIGHLIGHT_GRADIENT =
  'linear-gradient(88deg, rgb(105,105,105) 0%, rgb(176,174,174) 15.8%, rgb(114,114,114) 28.2%, rgb(177,177,177) 44%, rgb(105,105,105) 55.4%, rgb(177,177,177) 72.9%, rgb(105,105,105) 92.5%, rgb(207,207,207) 103%)'

interface Props {
  records: VinylRecord[]
  onSelect: (id: string) => void
  onAdd: () => void
  leftInset?: string
}

// The plank renders AFTER (on top of) the records so its top edge crisply
// touches the record's base — matching the reference (cover bottom sits
// ~1px into the plank top, essentially flush). Keep this small: it's a
// contact edge, not a ledge that swallows the record.
const OVERLAP = 1

export default function ShelfRowV2({ records, onSelect, onAdd, leftInset = '1rem' }: Props) {
  return (
    <div className="overflow-x-auto no-scrollbar" style={{ height: 110 }}>
      <div className="relative" style={{ width: 'max-content', minWidth: '100%', height: '100%' }}>
        <div
          className="relative flex items-end gap-3 pr-4 h-full"
          style={{ paddingLeft: leftInset, paddingBottom: PLANK_HEIGHT - OVERLAP }}
        >
          {records.length === 0 ? (
            <button
              onClick={onAdd}
              className="shrink-0 w-[92px] h-[92px] rounded-[3px] border border-dashed border-white/25 flex items-center justify-center text-white/35 text-[11px] font-mono"
            >
              [agregar]
            </button>
          ) : (
            records.map((r) => <RecordCardV2 key={r.id} record={r} onClick={() => onSelect(r.id)} />)
          )}
        </div>
        <div className="absolute right-4 bottom-0 pointer-events-none" style={{ left: leftInset, height: PLANK_HEIGHT }}>
          <div className="absolute inset-0 rounded-t-[3px]" style={{ bottom: '27%', backgroundImage: FRONT_FACE_GRADIENT }} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[3px]" style={{ top: '58.7%', backgroundImage: TOP_HIGHLIGHT_GRADIENT }} />
        </div>
      </div>
    </div>
  )
}
