'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FLEET_PAGE_SIZE_OPTIONS } from '../constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FleetPaginationProps {
  total: number
  page: number
  pageSize: number
  push: (updates: Record<string, string>) => void
}

export function FleetPagination({ total, page, pageSize, push }: FleetPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const goTo = (p: number) => push({ page: String(p) })

  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-faint">
        {total === 0
          ? 'Geen accounts'
          : totalPages <= 1
          ? `${total} accounts`
          : `${from}–${to} van ${total} accounts`}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-faint">
          <span>Per pagina</span>
          <Select value={String(pageSize)} onValueChange={(v) => push({ pageSize: v, page: '1' })}>
            <SelectTrigger className="h-7 w-16 text-[11px] bg-panel2 border-line2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-1.5 min-w-20">
              {FLEET_PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)} className="text-[11px]">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page <= 1}
              className={cn(
                'rounded p-1 transition-colors',
                page <= 1 ? 'text-line2 cursor-not-allowed' : 'text-faint hover:text-ink2 hover:bg-panel2'
              )}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-1 tabular-nums text-faint">{page} / {totalPages}</span>
            <button
              onClick={() => goTo(page + 1)}
              disabled={page >= totalPages}
              className={cn(
                'rounded p-1 transition-colors',
                page >= totalPages ? 'text-line2 cursor-not-allowed' : 'text-faint hover:text-ink2 hover:bg-panel2'
              )}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
