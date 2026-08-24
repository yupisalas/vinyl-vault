import type { VinylRecord } from '../../types'
import ShelfPageV2 from './ShelfPageV2'

interface Props {
  records: VinylRecord[]
  onSelect: (id: string) => void
  onAdd: () => void
}

function chunkIntoPairs(records: VinylRecord[]) {
  const pages: VinylRecord[][] = []
  for (let i = 0; i < records.length; i += 2) pages.push(records.slice(i, i + 2))
  return pages.length ? pages : [[]]
}

export default function ShelfRowV2({ records, onSelect, onAdd }: Props) {
  const pages = chunkIntoPairs(records)

  return (
    <div className="flex overflow-x-auto no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
      {pages.map((page, i) => (
        <ShelfPageV2 key={i} records={page} onSelect={onSelect} onAdd={onAdd} />
      ))}
    </div>
  )
}
