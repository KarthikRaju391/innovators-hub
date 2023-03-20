/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '',
      },
    ],
  },
}
//lh3.googleusercontent.com