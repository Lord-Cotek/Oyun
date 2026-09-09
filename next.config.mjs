/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  // "Family" was renamed to "Life" — keep old links (and notifications sent
  // before the rename) working.
  async redirects() {
    return [{ source: "/family", destination: "/life", permanent: false }];
  },
};

export default nextConfig;
