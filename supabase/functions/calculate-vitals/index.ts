import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// ---------------------------------------------------------------------------
// Scoring config types
// ---------------------------------------------------------------------------
interface GateThreshold {
  days: number | null // null = catch-all (>30 days)
  multiplier: number
}

interface ScoreConfig {
  id: string
  weights: { ritme: number; verankering: number; adoptie: number; resultaat: number }
  gate: GateThreshold[]
}

interface Dimensions {
  ritme: number
  verankering: number
  adoptie: number
  resultaat: number
}

// ---------------------------------------------------------------------------
// Canonical scoring logic — ported from os49-ground-control.html
// ---------------------------------------------------------------------------
function applyGate(daysSinceLastAction: number, thresholds: GateThreshold[]): number {
  const sorted = [...thresholds].sort((a, b) => (a.days ?? Infinity) - (b.days ?? Infinity))
  for (const t of sorted) {
    if (t.days === null || daysSinceLastAction <= t.days) return t.multiplier
  }
  return 0.4
}

function rawScore(dims: Dimensions, weights: ScoreConfig['weights']): number {
  return (
    dims.ritme * weights.ritme +
    dims.verankering * weights.verankering +
    dims.adoptie * weights.adoptie +
    dims.resultaat * weights.resultaat
  )
}

function calcVitals(dims: Dimensions, daysSince: number, config: ScoreConfig): number {
  const gate = applyGate(daysSince, config.gate)
  return Math.round(rawScore(dims, config.weights) * gate)
}

function calcBand(vitals: number): 'green' | 'amber' | 'red' {
  if (vitals >= 70) return 'green'
  if (vitals >= 40) return 'amber'
  return 'red'
}

// ---------------------------------------------------------------------------
// Dimension calculators — each returns 0–100
// ---------------------------------------------------------------------------

async function calcRitme(accountId: string, appSlugs: string[]): Promise<number> {
  const scores: number[] = []

  if (appSlugs.includes('mission_control')) {
    // Weekly KPI updates in last 4 weeks
    const { count: kpiCount } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', 'mission_control')
      .eq('event_type', 'kpi_updated')
      .gte('occurred_at', new Date(Date.now() - 28 * 86400000).toISOString())
    scores.push(Math.min(100, ((kpiCount ?? 0) / 4) * 100))

    // Transaction upload cadence
    const { count: txCount } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', 'mission_control')
      .eq('event_type', 'transaction_uploaded')
      .gte('occurred_at', new Date(Date.now() - 28 * 86400000).toISOString())
    scores.push(Math.min(100, ((txCount ?? 0) / 4) * 100))
  }

  if (appSlugs.includes('ops_grid')) {
    // Weekly SOP completions
    const { count: sopCount } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', 'ops_grid')
      .eq('event_type', 'sop_completed')
      .gte('occurred_at', new Date(Date.now() - 28 * 86400000).toISOString())
    scores.push(Math.min(100, ((sopCount ?? 0) / 4) * 100))
  }

  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

async function calcVerankering(
  accountId: string,
  appSlugs: string[],
  seatsGranted: number,
): Promise<number> {
  // Distinct active users in last 30 days
  const { data: activeUsers } = await supabase.rpc('fn_distinct_active_users', {
    p_account_id: accountId,
    p_days: 30,
  })
  const activeCount = activeUsers ?? 1
  const seatUtilization = Math.min(100, (activeCount / seatsGranted) * 100)

  // Bonus for team depth (employees beyond admin)
  const { count: memberCount } = await supabase
    .from('core.memberships' as any)
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .eq('status', 'active')
    .eq('role', 'member')
  const depthBonus = Math.min(20, (memberCount ?? 0) * 5)

  return Math.min(100, Math.round(seatUtilization * 0.8 + depthBonus))
}

async function calcAdoptie(accountId: string, appSlugs: string[]): Promise<number> {
  const scores: number[] = []

  // App opens across entitled apps
  for (const app of appSlugs) {
    const { count } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', app)
      .eq('event_type', 'app_opened')
      .gte('occurred_at', new Date(Date.now() - 30 * 86400000).toISOString())
    scores.push(count && count > 0 ? 100 : 0)
  }

  if (appSlugs.includes('mission_control')) {
    // AI advisor usage
    const { count: aiCount } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', 'mission_control')
      .eq('event_type', 'ai_advisor_used')
      .gte('occurred_at', new Date(Date.now() - 30 * 86400000).toISOString())
    scores.push(Math.min(100, ((aiCount ?? 0) / 2) * 100))
  }

  if (appSlugs.includes('strategic_base')) {
    // Plan creation
    const { count: planCount } = await supabase
      .from('core.events' as any)
      .select('*', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('app', 'strategic_base')
      .eq('event_type', 'plan_created')
      .gte('occurred_at', new Date(Date.now() - 90 * 86400000).toISOString())
    scores.push(Math.min(100, ((planCount ?? 0) / 2) * 100))
  }

  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

async function calcResultaat(accountId: string, appSlugs: string[]): Promise<number> {
  const scores: number[] = []

  if (appSlugs.includes('mission_control')) {
    // Grip score trend — latest vs 3 months ago
    const { data: gripRows } = await supabase
      .from('grip_score_history')
      .select('score, month')
      .eq('user_id', accountId)
      .order('month', { ascending: false })
      .limit(3)
    if (gripRows && gripRows.length >= 2) {
      const latest = gripRows[0].score
      const older = gripRows[gripRows.length - 1].score
      const trend = latest - older
      scores.push(Math.min(100, Math.max(0, 50 + trend * 5)))
    } else if (gripRows && gripRows.length === 1) {
      scores.push(Math.min(100, gripRows[0].score))
    }

    // KPI targets met
    const { data: metrics } = await supabase
      .from('mission_metrics')
      .select('status')
      .eq('user_id', accountId)
    if (metrics && metrics.length > 0) {
      const green = metrics.filter((m) => m.status === 'green').length
      scores.push(Math.round((green / metrics.length) * 100))
    }
  }

  if (appSlugs.includes('strategic_base')) {
    // Year/quarter plans existence
    const { count: yearPlanCount } = await supabase
      .from('strategic.year_plans' as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', accountId)
    const { count: quarterPlanCount } = await supabase
      .from('strategic.quarter_plans' as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', accountId)
    const planScore = Math.min(100, ((yearPlanCount ?? 0) > 0 ? 50 : 0) + ((quarterPlanCount ?? 0) > 0 ? 50 : 0))
    scores.push(planScore)
  }

  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

// ---------------------------------------------------------------------------
// Entitlement normalization — renormalize weights for entitled apps only
// ---------------------------------------------------------------------------
function normalizeWeights(
  appSlugs: string[],
  baseWeights: ScoreConfig['weights'],
): ScoreConfig['weights'] {
  const hasRitme = appSlugs.includes('mission_control') || appSlugs.includes('ops_grid')
  const hasVerankering = appSlugs.length > 0
  const hasAdoptie = appSlugs.length > 0
  const hasResultaat = appSlugs.includes('mission_control') || appSlugs.includes('strategic_base')

  const active = {
    ritme: hasRitme ? baseWeights.ritme : 0,
    verankering: hasVerankering ? baseWeights.verankering : 0,
    adoptie: hasAdoptie ? baseWeights.adoptie : 0,
    resultaat: hasResultaat ? baseWeights.resultaat : 0,
  }

  const total = Object.values(active).reduce((a, b) => a + b, 0)
  if (total === 0) return baseWeights

  return {
    ritme: active.ritme / total,
    verankering: active.verankering / total,
    adoptie: active.adoptie / total,
    resultaat: active.resultaat / total,
  }
}

// ---------------------------------------------------------------------------
// Days since last meaningful action
// ---------------------------------------------------------------------------
async function daysSinceLastAction(accountId: string): Promise<number> {
  const { data } = await supabase
    .from('core.events' as any)
    .select('occurred_at')
    .eq('account_id', accountId)
    .order('occurred_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return 999
  const diff = Date.now() - new Date(data.occurred_at).getTime()
  return Math.floor(diff / 86400000)
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  const { account_id } = await req.json()
  if (!account_id) {
    return new Response(JSON.stringify({ error: 'account_id required' }), { status: 400 })
  }

  // Load active score config
  const { data: configRow, error: configErr } = await supabase
    .from('core.score_config' as any)
    .select('*')
    .eq('is_active', true)
    .single()
  if (configErr || !configRow) {
    return new Response(JSON.stringify({ error: 'No active score config' }), { status: 500 })
  }
  const config = configRow as ScoreConfig

  // Load account entitlements from payments
  const { data: sub } = await supabase
    .from('payments.subscriptions' as any)
    .select('plan_id, payments.plans(app_slugs, included_seats_per_app)')
    .eq('account_id', account_id)
    .eq('status', 'active')
    .single()

  const appSlugs: string[] = (sub as any)?.['payments.plans']?.app_slugs ?? []
  const seatsGranted: number = (sub as any)?.['payments.plans']?.included_seats_per_app ?? 9

  // Normalize weights for entitled apps
  const weights = normalizeWeights(appSlugs, config.weights)
  const normalizedConfig = { ...config, weights }

  // Calculate all dimensions in parallel
  const [ritme, verankering, adoptie, resultaat, daysSince] = await Promise.all([
    calcRitme(account_id, appSlugs),
    calcVerankering(account_id, appSlugs, seatsGranted),
    calcAdoptie(account_id, appSlugs),
    calcResultaat(account_id, appSlugs),
    daysSinceLastAction(account_id),
  ])

  const dims: Dimensions = { ritme, verankering, adoptie, resultaat }
  const gate = applyGate(daysSince, config.gate)
  const vitalsScore = calcVitals(dims, daysSince, normalizedConfig)
  const band = calcBand(vitalsScore)

  // Write snapshot
  const { error: snapErr } = await supabase.from('core.vitals_snapshots' as any).insert({
    account_id,
    score_config_id: config.id,
    vitals: vitalsScore,
    ritme,
    verankering,
    adoptie,
    resultaat,
    gate_multiplier: gate,
    band,
  })

  if (snapErr) {
    return new Response(JSON.stringify({ error: snapErr.message }), { status: 500 })
  }

  return new Response(
    JSON.stringify({ account_id, vitals: vitalsScore, band, dims, gate, days_since: daysSince }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
