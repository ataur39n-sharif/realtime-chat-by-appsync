/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    APPSYNC_HTTPS_MESSAGE_API_ENDPOINT: process.env.APPSYNC_HTTPS_MESSAGE_API_ENDPOINT,
    APPSYNC_WS_MESSAGE_API_ENDPOINT: process.env.APPSYNC_WS_MESSAGE_API_ENDPOINT,
    APPSYNC_API_KEY: process.env.APPSYNC_API_KEY,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION
  }
};

module.exports = nextConfig;