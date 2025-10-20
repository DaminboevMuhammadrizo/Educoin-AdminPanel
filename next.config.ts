/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['cdn-icons-png.flaticon.com'],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
        optimizeCss: true,
    },
    // swcMinify ni experimental dan chiqarib, asosiy config ga qo'ying
    swcMinify: true,
    compress: true,
    trailingSlash: true,
}

export default nextConfig
