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
}

module.exports = nextConfig