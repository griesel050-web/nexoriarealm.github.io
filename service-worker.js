const CACHE_NAME = 'nexoria-static-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Helper: network-first for API calls, cache-first for others
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Keep API calls network-first (fresh data). If network fails, fallback to cache if any.
  if (url.hostname.includes('api.mcsrvstat.us')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Optionally cache a clone of API responses for brief offline reuse
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // For navigation requests (HTML), try network then fallback to cache index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          // Optionally update cache with fresh page
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', resClone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For static assets: cache-first, falling back to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkRes => {
        // Optionally cache new resource (runtime caching) for future use
        // Only cache same-origin static requests to avoid third-party caching issues
        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkRes.clone()));
        }
        return networkRes;
      }).catch(() => {
        // final fallback: return cached index.html for navigations or nothing
        return event.request.destination === 'document' ? caches.match('/index.html') : undefined;
      });
    })
  );
});
