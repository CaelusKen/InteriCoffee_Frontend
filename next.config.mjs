/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/v0/b/intericoffee-442da.appspot.com/**',
          },
        ],
    },
    reactStrictMode: true,
    env: {
      NEXTAUTH_URL: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },
};

export default nextConfig;
