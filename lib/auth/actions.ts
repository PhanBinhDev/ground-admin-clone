'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: 'global' })

  const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL
  const clientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID

  await fetch(`${authServerUrl}/api/logout?client_id=${clientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {})

  const ssoUrl = new URL(`${authServerUrl}/authorize`)
  ssoUrl.searchParams.set('client_id', clientId!)
  ssoUrl.searchParams.set(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_APP_URL}/oauth/callback`
  )
  redirect(ssoUrl.toString())
}
