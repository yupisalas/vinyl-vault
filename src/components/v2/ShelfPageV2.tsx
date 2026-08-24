import type { VinylRecord } from '../../types'
import RecordCardV2 from './RecordCardV2'

const PLANK_GRADIENT =
  'linear-gradient(88deg, rgb(105,105,105) 0%, rgb(176,174,174) 15.8%, rgb(114,114,114) 28.2%, rgb(177,177,177) 44%, rgb(105,105,105) 55.4%, rgb(177,177,177) 72.9%, rgb(105,105,105) 92.5%, rgb(207,207,207) 103%)'

export const SHELF_PAGE_WIDTH = 280

interface Props {
  records: VinylRecord[]
  onSelect: (id: string) => void
  onAdd: () => void
}

export default function ShelfPageV2({ records, onSelect, onAdd }: Props) {
  return (
    <div className="relative shrink-0" style={{ width: SHELF_PAGE_WIDTH, height: 110, scrollSnapAlign: 'start' }}>
      <div className="relative flex items-end gap-4 h-full pl-3 pr-3 pb-3.5">
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
      <div className="absolute left-3 right-3 bottom-0 h-[9px] rounded-t-[3px] pointer-events-none" style={{ backgroundImage: PLANK_GRADIENT }} />
    </div>
  )
}
