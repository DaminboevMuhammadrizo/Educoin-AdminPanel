/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
