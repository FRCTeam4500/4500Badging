/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "docs.google.com",
      "images.unsplash.com",
      "img.clerk.com",
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
