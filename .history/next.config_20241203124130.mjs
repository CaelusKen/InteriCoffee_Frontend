import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocket } from './src/lib/socket.js';

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

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: nextConfig });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });

  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  initSocket(httpServer);

  httpServer.listen(3001, () => {
    console.log('> Socket.IO server running on http://localhost:3001');
  });
});

export default nextConfig;