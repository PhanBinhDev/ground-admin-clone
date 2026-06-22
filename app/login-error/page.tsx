import Link from 'next/link'

export default function LoginErrorPage() {
  const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL
  const clientId = process.env.NEXT_PUBLIC_SSO_CLIENT_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const retryUrl =
    authServerUrl && clientId && appUrl
      ? `${authServerUrl}/authorize?client_id=${clientId}&redirect_uri=${appUrl}/oauth/callback`
      : '/login'

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-cinzel text-2xl text-copper">Inloggen mislukt</h1>
      <p className="text-muted-foreground text-sm">
        Er is iets misgegaan tijdens het inloggen. Probeer het opnieuw.
      </p>
      <Link
        href={retryUrl}
        className="text-sm text-copper underline underline-offset-4 hover:opacity-80 transition-opacity"
      >
        Opnieuw proberen
      </Link>
    </div>
  )
}
