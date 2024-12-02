/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... other config options
    async redirects() {
      return [
        {
          source: '/404',
          destination: '/url-error',
          permanent: true,
        },
      ]
    },
  }
  
  module.exports = nextConfig