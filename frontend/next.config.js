/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://hr-saas-platform.your-subdomain.workers.dev/api/:path*'
          : 'http://localhost:5001/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;