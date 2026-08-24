import vinylCrescent from '../../assets/figma/v2/vinyl-crescent.png'
import { coverGradient } from '../../lib/palette'
import type { VinylRecord } from '../../types'
import { IconHeart } from '../icons'

interface Props {
  record: VinylRecord
  onClick?: () => void
}

// Measured off the Figma "estante con discos" reference (123:570):
// cover-to-cover gap with no vinyl is ~12px (matches the row's flex gap),
// and a vinyl peek is ~44px wide overlapping ~16px into its own cover.
const COVER_SIZE = 92
const VINYL_WIDTH = 44
const VINYL_OVERLAP = 16

export default function RecordCardV2({ record, onClick }: Props) {
  const isWant = record.status === 'want'

  return (
    <button
      onClick={onClick}
      className="relative shrink-0 flex items-end"
      style={{ width: COVER_SIZE + (isWant ? 0 : VINYL_WIDTH), height: COVER_SIZE + 4 }}
    >
      {!isWant && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: COVER_SIZE - VINYL_OVERLAP,
            bottom: 0,
            width: VINYL_WIDTH,
            height: COVER_SIZE * 0.94,
            backgroundImage: `url(${vinylCrescent})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      <div
        className="relative overflow-hidden shrink-0"
        style={{
          width: COVER_SIZE,
          height: COVER_SIZE,
          borderRadius: '2px 3px 3px 1px',
          boxShadow: '-2px 2px 5px 1px rgba(0,0,0,0.5)',
          background: record.coverImage ? `url(${record.coverImage}) center/cover no-repeat` : coverGradient(record.title),
        }}
      >
        {!record.coverImage && (
          <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
            <span className="font-display text-white text-[10px] leading-tight drop-shadow">{record.title}</span>
          </div>
        )}
        {isWant && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <IconHeart className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </div>
    </button>
  )
}
