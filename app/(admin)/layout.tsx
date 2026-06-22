import { requireOsAdmin } from '@/lib/auth/profile'
import { Sidebar } from '@/components/shell/sidebar'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireOsAdmin()
  return (
    <div className="flex h-screen overflow-hidden bg-obsidian">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
