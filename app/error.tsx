'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="font-mono text-6xl text-faint">500</p>
      <h1 className="font-cinzel text-xl text-ink tracking-widest uppercase">Er is iets misgegaan</h1>
      {error.digest && (
        <p className="font-mono text-xs text-faint">digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="text-xs text-muted underline underline-offset-4 hover:text-ink transition-colors"
      >
        Opnieuw proberen
      </button>
    </div>
  )
}
