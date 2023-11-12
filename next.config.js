/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "uploadthing.com",
      },
      {
        hostname: "docs.google.com"
      },
      {
        hostname: "images.unsplash.com"
      },
      {
        hostname: "img.clerk.com"
      }
    ]
  },
  compiler: {
    styledComponents: true,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig);
