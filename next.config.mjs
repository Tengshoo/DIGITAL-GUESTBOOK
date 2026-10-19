import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If deploying to username.github.io/DIGITAL-GUESTBOOK, set NEXT_PUBLIC_BASE_PATH='/DIGITAL-GUESTBOOK'
// If deploying with custom domain (e.g. armanfarah.com), leave NEXT_PUBLIC_BASE_PATH empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
