export type VitalsBand = 'red' | 'amber' | 'green' | 'purple'

export type ActivePlan = {
  plan_name: string
  plan_slug: string
  billing_interval: string
  status: string
  current_period_end: string | null
}

export type FleetAccount = {
  id: string
  billing_name: string
  billing_company: string | null
  email: string
  created_at: string
  active_plans: ActivePlan[]
  cancel_at_period_end: boolean | null
  vitals: number | null
  band: VitalsBand | null
  ritme: number | null
  verankering: number | null
  adoptie: number | null
  resultaat: number | null
  vitals_at: string | null
  active_members: number
  total_count: number
}

export type FleetParams = {
  search?: string
  band?: VitalsBand | ''
  page?: number
  pageSize?: number
}
