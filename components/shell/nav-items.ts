import { LayoutGrid, Users, MessageSquare, type LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Vloot', href: '/fleet', icon: LayoutGrid },
  { label: 'Team-toegang', href: '/team', icon: Users },
  { label: 'Push-berichten', href: '/push', icon: MessageSquare },
]
