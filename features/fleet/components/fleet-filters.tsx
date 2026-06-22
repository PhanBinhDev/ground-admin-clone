'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import type { VitalsBand } from '../types'

const BANDS: { value: VitalsBand | ''; label: string }[] = [
  { value: '',       label: 'Alle' },
  { value: 'purple', label: 'Top' },
  { value: 'green',  label: 'Gezond' },
  { value: 'amber',  label: 'Matig' },
  { value: 'red',    label: 'Kritiek' },
]

interface FleetFiltersProps {
  search: string
  band: string
  push: (updates: Record<string, string>) => void
}

export function FleetFilters({ search, band, push }: FleetFiltersProps) {
  const [inputValue, setInputValue] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setInputValue(search) }, [search])

  const handleSearch = (value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => push({ search: value }), 300)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-xs">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
        <Input
          placeholder="Zoek account…"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-7 h-8 text-xs bg-panel2 border-line2"
        />
      </div>

      <div className="flex items-center h-8 gap-0.5 rounded-md border border-line2 bg-panel2 px-1">
        {BANDS.map((b) => (
          <button
            key={b.value}
            onClick={() => push({ band: b.value })}
            className={cn(
              'rounded px-2.5 h-6 text-[11px] transition-colors',
              band === b.value || (b.value === '' && !band)
                ? 'bg-panel3 text-ink'
                : 'text-faint hover:text-ink2 hover:bg-panel3/50'
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
