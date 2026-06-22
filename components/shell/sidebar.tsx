'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'
import type { CoreProfile } from '@/lib/auth/profile'
import { Hint } from '@/components/ui/hint'
import useModal from '@/hooks/use-modal'

interface SidebarProps {
  profile: CoreProfile
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { openModal } = useModal()

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-line2 bg-panel transition-all duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center justify-between border-b border-line2 px-3">
        {!collapsed && (
          <span className="font-cinzel text-[10px] tracking-[0.22em] text-copper-br uppercase truncate">
            Ground Control
          </span>
        )}
        <Hint label={collapsed ? 'Uitklappen' : 'Inklappen'} side="right">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'rounded p-1 text-faint hover:bg-panel2 hover:text-ink2 transition-colors shrink-0',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed
              ? <PanelLeftOpen size={14} strokeWidth={1.5} />
              : <PanelLeftClose size={14} strokeWidth={1.5} />
            }
          </button>
        </Hint>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2 pt-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Hint key={item.href} label={collapsed ? item.label : ''} side="right">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center rounded-md px-2.5 py-2 text-[11.5px] tracking-[.02em] transition-colors duration-100',
                  collapsed ? 'justify-center' : 'gap-2.5',
                  active
                    ? 'bg-panel3 text-ink'
                    : 'text-muted-foreground hover:bg-panel2 hover:text-ink2'
                )}
              >
                <item.icon size={13} strokeWidth={1.5} className="shrink-0" />
                {!collapsed && item.label}
              </Link>
            </Hint>
          )
        })}
      </nav>

      {/* Account + logout */}
      <div className={cn('border-t border-line2 p-2', collapsed && 'flex justify-center')}>
        {collapsed ? (
          <Hint label="Uitloggen" side="right">
            <button
              onClick={() => openModal('CONFIRM_LOGOUT')}
              className="flex items-center justify-center rounded-md p-2 text-faint hover:text-ink2 hover:bg-panel2 transition-colors"
            >
              <LogOut size={13} strokeWidth={1.5} />
            </button>
          </Hint>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-panel2 transition-colors">
            <div className="min-w-0">
              <p className="truncate text-[11.5px] text-ink2 leading-tight">{profile.full_name ?? profile.email}</p>
              {profile.full_name && (
                <p className="truncate text-[10px] text-faint mt-0.5">{profile.email}</p>
              )}
            </div>
            <Hint label="Uitloggen" side="right">
              <button
                onClick={() => openModal('CONFIRM_LOGOUT')}
                className="shrink-0 rounded p-1 text-faint hover:text-ink2 transition-colors"
              >
                <LogOut size={13} strokeWidth={1.5} />
              </button>
            </Hint>
          </div>
        )}
      </div>
    </aside>
  )
}
