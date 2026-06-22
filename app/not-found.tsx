import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="font-mono text-6xl text-faint">404</p>
      <h1 className="font-cinzel text-xl text-ink tracking-widest uppercase">Pagina niet gevonden</h1>
      <Link href="/" className="text-xs text-muted underline underline-offset-4 hover:text-ink transition-colors">
        Terug naar basis
      </Link>
    </div>
  )
}
