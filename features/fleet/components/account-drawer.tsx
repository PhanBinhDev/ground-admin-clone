'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FleetAccount } from '../types'
import { BandBadge } from './band-badge'

function ScoreBar({ value, color }: { value: number | null; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-panel3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value ?? 0}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-6 text-right tabular-nums text-[11px] text-ink2">{value ?? '–'}</span>
    </div>
  )
}

function formatDate(iso: string | null) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

const DIM_COLORS: Record<string, string> = {
  ritme:      '#BC7053',
  verankering: '#4F7BB0',
  adoptie:    '#CBA14A',
  resultaat:  '#5E9E7E',
}

interface AccountDrawerProps {
  account: FleetAccount | null
  onClose: () => void
}

export function AccountDrawer({ account, onClose }: AccountDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-obsidian/60 transition-opacity',
          account ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-96 flex flex-col bg-panel border-l border-line2 transition-transform duration-200',
          account ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {!account ? null : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line2 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[13px] text-ink font-medium truncate">
                  {account.billing_company || account.billing_name}
                </p>
                <p className="text-[11px] text-faint mt-0.5">{account.email}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded p-1 text-faint hover:text-ink2 hover:bg-panel2 transition-colors mt-0.5"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Status */}
              <section className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-wider text-faint font-medium">Abonnement</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px]">
                  <span className="text-faint">Plan</span>
                  <span className="text-ink2">{account.plan_name ?? '–'}</span>
                  <span className="text-faint">Interval</span>
                  <span className="text-ink2 capitalize">{account.billing_interval ?? '–'}</span>
                  <span className="text-faint">Status</span>
                  <span className="text-ink2 capitalize">{account.sub_status ?? '–'}</span>
                  <span className="text-faint">Loopt af</span>
                  <span className="text-ink2">{formatDate(account.current_period_end)}</span>
                  {account.cancel_at_period_end && (
                    <>
                      <span className="text-faint">Opzegdatum</span>
                      <span className="text-band-amber">Einde periode</span>
                    </>
                  )}
                  <span className="text-faint">Leden</span>
                  <span className="text-ink2">{account.active_members}</span>
                  <span className="text-faint">Aangemeld</span>
                  <span className="text-ink2">{formatDate(account.created_at)}</span>
                </div>
              </section>

              {/* Vitals */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] uppercase tracking-wider text-faint font-medium">Vitals</h3>
                  <BandBadge band={account.band} />
                </div>

                {account.vitals != null ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11.5px] mb-1">
                      <span className="text-faint">Totaalscore</span>
                      <span className="text-ink font-medium tabular-nums">{account.vitals}</span>
                    </div>
                    <div className="space-y-2.5">
                      {(['ritme', 'verankering', 'adoptie', 'resultaat'] as const).map((dim) => (
                        <div key={dim} className="space-y-1">
                          <div className="flex justify-between text-[10.5px]">
                            <span className="text-faint capitalize">{dim}</span>
                          </div>
                          <ScoreBar value={account[dim]} color={DIM_COLORS[dim]} />
                        </div>
                      ))}
                    </div>
                    {account.vitals_at && (
                      <p className="text-[10px] text-faint">Berekend op {formatDate(account.vitals_at)}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11.5px] text-faint">Nog geen vitals berekend</p>
                )}
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
