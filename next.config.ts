// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;



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
        swcMinify: true,
    },
    // Compression
    compress: true,
    // Static optimization
    trailingSlash: true,
}

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

export default nextConfig
