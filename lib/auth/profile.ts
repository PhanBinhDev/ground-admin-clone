import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/types/database'
import { redirect } from 'next/navigation'
import { cache } from 'react'

const LOGIN_PATH = '/login'
const UNAUTHORIZED_PATH = '/unauthorized'

export type CoreProfile = Tables<{ schema: 'core' }, 'profiles'>
export type Os49Role = Tables<{ schema: 'core' }, 'os49_roles'>

export const getCurrentProfile = cache(
  async (): Promise<CoreProfile | null> => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const userId = data?.claims?.sub
    if (!userId) return null

    const { data: profile } = await supabase
      .schema('core')
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return profile ?? null
  }
)

export const getOsAdminRole = cache(async (): Promise<Os49Role | null> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (!userId) return null

  const { data: roleRow } = await supabase
    .schema('core')
    .from('os49_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'os49_admin')
    .single()

  return roleRow ?? null
})

export async function requireOsAdmin(): Promise<CoreProfile> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) redirect(LOGIN_PATH)

  const role = await getOsAdminRole()
  if (!role) redirect(UNAUTHORIZED_PATH)

  const profile = await getCurrentProfile()
  if (!profile) redirect(UNAUTHORIZED_PATH)

  return profile
}
