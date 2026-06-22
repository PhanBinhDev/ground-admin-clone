import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/oauth/callback', '/login-error']

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (!userId) {
    const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL
    const clientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!authServerUrl || !clientId || !appUrl) {
      return NextResponse.redirect(new URL('/login-error', request.url))
    }

    const ssoUrl = new URL(`${authServerUrl}/authorize`)
    ssoUrl.searchParams.set('client_id', clientId)
    ssoUrl.searchParams.set('redirect_uri', `${appUrl}/oauth/callback`)
    return NextResponse.redirect(ssoUrl)
  }

  return supabaseResponse
}
