import type { NextConfig } from 'next'

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '*.supabase.co'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHostname, pathname: '/storage/v1/object/**' },
    ],
  },
  experimental: {
    staleTimes: { dynamic: 300, static: 600 },
  },
}

export default nextConfig
