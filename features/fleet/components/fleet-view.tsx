'use client'

import { Suspense, useState, useTransition, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { FleetAccount } from '../types'
import { FleetTable } from './fleet-table'
import { AccountDrawer } from './account-drawer'
import { FleetFilters } from './fleet-filters'
import { FleetPagination } from './fleet-pagination'
import { FleetCsvButton } from './fleet-csv-button'
import { Skeleton } from '@/components/ui/skeleton'

interface FleetViewProps {
  accounts: FleetAccount[]
  total: number
  page: number
  pageSize: number
  search: string
  band: string
}

export function FleetView({ accounts, total, page, pageSize, search, band }: FleetViewProps) {
  const [selected, setSelected] = useState<FleetAccount | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      params.delete('page')
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [router, pathname, searchParams]
  )

  return (
    <>
      <div className="space-y-3">
        <Suspense fallback={<Skeleton className="h-8 w-96" />}>
          <div className="flex items-center gap-2">
            <FleetFilters search={search} band={band} push={push} />
            <FleetCsvButton accounts={accounts} />
          </div>
        </Suspense>

        <div className={cn('transition-opacity duration-150', isPending && 'opacity-60 pointer-events-none')}>
          <FleetTable accounts={accounts} onSelect={setSelected} />
        </div>

        <Suspense fallback={null}>
          <FleetPagination total={total} page={page} pageSize={pageSize} push={push} />
        </Suspense>
      </div>
      <AccountDrawer account={selected} onClose={() => setSelected(null)} />
    </>
  )
}
