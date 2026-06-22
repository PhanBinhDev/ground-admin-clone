import { cn } from '@/lib/utils'
import type { VitalsBand } from '../types'

const BAND_CONFIG: Record<VitalsBand, { label: string; className: string }> = {
  red:    { label: 'Kritiek',  className: 'bg-band-red/15 text-band-red border-band-red/30' },
  amber:  { label: 'Matig',   className: 'bg-band-amber/15 text-band-amber border-band-amber/30' },
  green:  { label: 'Gezond',  className: 'bg-band-green/15 text-band-green border-band-green/30' },
  purple: { label: 'Top',     className: 'bg-band-purple/15 text-band-purple border-band-purple/30' },
}

export function BandBadge({ band }: { band: VitalsBand | null }) {
  if (!band) {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] border border-line text-faint">
        –
      </span>
    )
  }
  const { label, className } = BAND_CONFIG[band]
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[10px] border font-medium', className)}>
      {label}
    </span>
  )
}
