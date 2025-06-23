/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SALESFORCE_INSTANCE_URL: process.env.SALESFORCE_INSTANCE_URL,
    SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors are present
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.force.com',
      },
      {
        protocol: 'https',
        hostname: '*.file.force.com',
      },
      {
        protocol: 'https',
        hostname: '*.develop.file.force.com',
      },
      {
        protocol: 'https',
        hostname: '*.my.salesforce.com',
      },
    ],
  },
}

module.exports = nextConfig