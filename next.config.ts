/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
    unoptimized: true, // NETLIFY UCHUN MUHIM
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // swcMinify ni olib tashlang yoki comment qiling
  // swcMinify: true,
  compress: true,
  trailingSlash: true,
  // NETLIFY UCHUN QO'SHIMCHA
  output: 'standalone', // yoki 'export'
}

export default nextConfig
