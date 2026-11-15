/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Security headers on every response.
   *
   * - No framing: nobody can load these pages inside their own site and
   *   trick a tap ("clickjacking"), least of all the admin centre.
   * - nosniff: a file is only ever what it says it is.
   * - Referrer: other sites learn only that somebody came from here, never
   *   the page — and from the pages whose address IS the key (an invitation,
   *   a shared post, a registry, a reset or confirmation link) not even that.
   * - HSTS: once seen over HTTPS, never over anything less.
   * - Permissions: no camera, microphone or location; nothing here uses them.
   */
  async headers() {
    const base = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
    ];
    const keyed = ["/i/:path*", "/p/:path*", "/r/:path*", "/reset-password", "/confirm-email", "/unsubscribe"];
    return [
      { source: "/:path*", headers: base },
      ...keyed.map((source) => ({ source, headers: [{ key: "Referrer-Policy", value: "no-referrer" }] })),
    ];
  },
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
