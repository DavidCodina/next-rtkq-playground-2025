import type { NextConfig } from 'next'

const EXTERNAL_SERVER_URL = process.env.EXTERNAL_SERVER_URL

if (!EXTERNAL_SERVER_URL) {
  throw new Error('EXTERNAL_SERVER_URL environment variable is not set.')
}

const nextConfig: NextConfig = {
  // reactStrictMode: false, // ⚠️ Only uncomment this for testing during development.
  // https://nextjs.org/docs/app/api-reference/next-config-js/logging
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    domains: [
      // 'upload.wikimedia.org',
      // 'images.pexels.com',
      // 'images.unsplash.com'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${EXTERNAL_SERVER_URL}/api/:path*`
      }
    ]
  }
}

export default nextConfig
