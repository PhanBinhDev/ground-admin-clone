'use client'

import type { FleetAccount } from '../types'
import { BandBadge } from './band-badge'

function formatDate(iso: string | null) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}


interface FleetTableProps {
  accounts: FleetAccount[]
  onSelect: (account: FleetAccount) => void
}

export function FleetTable({ accounts, onSelect }: FleetTableProps) {
  return (
    <div className="rounded-md border border-line2 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line2 bg-panel2">
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-faint font-medium">Account</th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-faint font-medium">Plannen</th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-faint font-medium w-20">Band</th>
              <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wider text-faint font-medium w-16">Vitals</th>
              <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wider text-faint font-medium w-16">Leden</th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-faint font-medium w-28">Aangemeld</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-faint text-[11px]">
                  Geen accounts gevonden
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => onSelect(account)}
                  className="border-b border-line last:border-0 hover:bg-panel2 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <p className="text-ink2 truncate max-w-[200px]">
                      {account.billing_company || account.billing_name}
                    </p>
                    <p className="text-[10px] text-faint truncate max-w-[200px]">{account.email}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    {account.active_plans.length > 0 ? (
                      <div className="space-y-0.5">
                        {account.active_plans.map((p, i) => (
                          <div key={i}>
                            <p className="text-ink2">{p.plan_name}</p>
                            <p className="text-[10px] text-faint capitalize">{p.billing_interval}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-faint">–</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <BandBadge band={account.band} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {account.vitals != null ? (
                      <span className="text-ink2">{account.vitals}</span>
                    ) : (
                      <span className="text-faint">–</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-ink2">
                    {account.active_members}
                  </td>
                  <td className="px-3 py-2.5 text-faint">{formatDate(account.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  )
}
