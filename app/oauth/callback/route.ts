import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login-error', request.url))
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/exchange`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_SSO_CLIENT_ID!,
        client_secret: process.env.SSO_CLIENT_SECRET!,
      }),
    }
  )

  if (!res.ok) {
    return NextResponse.redirect(
      new URL('/login-error', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  const { hashed_token } = await res.json()

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: hashed_token,
    type: 'magiclink',
  })

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL('/login-error', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  return NextResponse.redirect(new URL('/', request.url))
}
