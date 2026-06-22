import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { FLEET_PAGE_SIZE } from './constants'
import type { FleetAccount, FleetParams } from './types'

export type { FleetAccount, FleetParams, VitalsBand } from './types'
export { FLEET_PAGE_SIZE } from './constants'

export async function getFleetAccounts(params: FleetParams = {}): Promise<{ accounts: FleetAccount[]; total: number }> {
  const supabase = await createClient()
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? FLEET_PAGE_SIZE
  const offset = (page - 1) * pageSize

  const { data, error } = await supabase.rpc('get_fleet_accounts' as never, {
    p_search: params.search || null,
    p_band: params.band || null,
    p_limit: pageSize,
    p_offset: offset,
  })

  if (error) {
    console.error('get_fleet_accounts error:', error)
    return { accounts: [], total: 0 }
  }

  const rows = (data as FleetAccount[]) ?? []
  const total = rows[0]?.total_count ?? 0

  return { accounts: rows, total }
}
