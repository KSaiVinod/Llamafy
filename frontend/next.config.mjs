/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/app/:path*',
        has: [
          {
            type: 'host',
            value: new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
          }
        ],
        destination: `${process.env.NEXT_BACKEND_URL}/:path*`
      }
    ]
  }
}

export default nextConfig
