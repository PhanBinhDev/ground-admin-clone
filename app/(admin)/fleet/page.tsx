import { getFleetAccounts, type VitalsBand } from '@/features/fleet/queries'
import { FleetView } from '@/features/fleet/components/fleet-view'
import { FLEET_PAGE_SIZE, FLEET_PAGE_SIZE_OPTIONS } from '@/features/fleet/constants'

interface FleetPageProps {
  searchParams: Promise<{ search?: string; band?: string; page?: string; pageSize?: string }>
}

export default async function FleetPage({ searchParams }: FleetPageProps) {
  const { search = '', band = '', page: pageStr = '1', pageSize: pageSizeStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr, 10) || 1)
  const pageSize = FLEET_PAGE_SIZE_OPTIONS.includes(Number(pageSizeStr))
    ? Number(pageSizeStr)
    : FLEET_PAGE_SIZE

  const { accounts, total } = await getFleetAccounts({
    search,
    band: band as VitalsBand | '',
    page,
    pageSize,
  })

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-[15px] font-medium text-ink">Vloot</h1>
        <p className="text-[11.5px] text-faint mt-0.5">Alle actieve accounts en hun gezondheidsstatus</p>
      </div>
      <FleetView
        accounts={accounts}
        total={total}
        page={page}
        pageSize={pageSize}
        search={search}
        band={band}
      />
    </div>
  )
}
