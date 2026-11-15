// Oyun service worker.
//
// IMPORTANT: never cache HTML documents or navigations — those pages are
// per-user and per-session. Caching them would let one signed-in account see
// another account's rendered pages. We only cache static, fingerprinted assets
// (which are identical for every user), and always let pages hit the network.
const CACHE = "oyun-v3";
// The one page kept for offline use: static, the same for everybody, and
// holding nothing about anyone. Never a real page.
const OFFLINE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.add(new Request(OFFLINE, { cache: "reload" })).catch(() => {});
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      // Drop every old cache — including v1, which wrongly stored authed pages.
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// ── Web Push ──────────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "Oyun", body: "", href: "/journey" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body || undefined,
      icon: "/oyun-icon-192.png",
      badge: "/oyun-icon-192.png",
      data: { href: data.href || "/journey" },
      tag: data.tag || undefined,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = (event.notification.data && event.notification.data.href) || "/journey";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of all) {
        if ("focus" in client) {
          client.navigate(href);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(href);
    })(),
  );
});

// ── Fetch: static assets only ──────────────────────────────────────────────
const STATIC_RE = /\.(?:png|svg|ico|jpg|jpeg|webp|gif|woff2?|ttf|css|js|json)$/i;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept navigations, HTML, or API calls — always fresh from network.
  const accept = req.headers.get("accept") || "";
  if (req.mode === "navigate") {
    // Always the network, never a stored page. Only when the network cannot
    // be reached at all does the static offline page stand in.
    event.respondWith(
      fetch(req).catch(async () => (await caches.match(OFFLINE)) || Response.error()),
    );
    return;
  }
  if (accept.includes("text/html")) return;
  if (url.pathname.startsWith("/api/")) return;

  // Only cache static, fingerprinted assets that are identical for every user.
  const isStatic = url.pathname.startsWith("/_next/static/") || STATIC_RE.test(url.pathname);
  if (!isStatic) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === "basic") {
          const cache = await caches.open(CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return caches.match(req).then((c) => c || Response.error());
      }
    })(),
  );
});
