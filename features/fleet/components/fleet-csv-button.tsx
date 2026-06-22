'use client'

import { Download } from 'lucide-react'
import type { FleetAccount } from '../types'

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function FleetCsvButton({ accounts }: { accounts: FleetAccount[] }) {
  const exportCsv = () => {
    const headers = ['Naam', 'Bedrijf', 'E-mail', 'Plannen', 'Band', 'Vitals', 'Leden', 'Aangemeld']
    const rows = accounts.map((a) => [
      a.billing_name,
      a.billing_company ?? '',
      a.email,
      a.active_plans.map((p) => p.plan_name).join(' / '),
      a.band ?? '',
      a.vitals ?? '',
      a.active_members,
      formatDate(a.created_at),
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportCsv}
      className="flex items-center gap-1.5 h-8 rounded-md border border-line2 bg-panel2 px-3 text-[11px] text-faint hover:text-ink2 hover:border-line transition-colors shrink-0"
    >
      <Download size={12} />
      CSV
    </button>
  )
}
