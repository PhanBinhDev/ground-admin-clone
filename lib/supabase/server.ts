import 'server-only'
import type { Database } from '@/lib/types/database'
import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const clientIp = (headerStore.get('x-forwarded-for') ?? '').split(',')[0].trim()
  const clientUa = headerStore.get('user-agent') ?? ''
  const forwarded: Record<string, string> = {}
  if (clientIp) forwarded['x-client-ip'] = clientIp
  if (clientUa) forwarded['x-client-user-agent'] = clientUa

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: forwarded },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Component — safe to ignore, middleware handles session refresh
          }
        },
      },
    },
  )
}
