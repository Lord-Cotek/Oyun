/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  async redirects() {
    return [
      // "Family" was renamed to "Life" — keep old links (and notifications
      // sent before the rename) working.
      { source: "/family", destination: "/life", permanent: false },

      /**
       * Both apps keep the same thing in the same place, so both answer to the
       * same name. Ìdílé calls it /dates; here the room grew out of the
       * appointment book and kept that name, and renaming the route would
       * break every link and notification already sent.
       *
       * Temporary rather than permanent, matching the entry above: a 308 is
       * cached by browsers more or less for ever, and if /dates ever becomes a
       * page of its own here, that cache is very hard to take back.
       */
      { source: "/dates", destination: "/appointments", permanent: false },
    ];
  },
};

export default nextConfig;
