// ── FUTURE SAKATO DYNAMICS – SERVICE WORKER ──
var CACHE_NAME = 'fusako-v1';

// File-file yang di-cache saat pertama kali install
var ASSETS = [
  '/Future-Sakato-Dynamics/',
  '/Future-Sakato-Dynamics/index.html',
  '/Future-Sakato-Dynamics/404.html'
];

// ── INSTALL: simpan semua aset ke cache ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: hapus cache lama ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// ── FETCH: coba network dulu, fallback ke cache ──
self.addEventListener('fetch', function(e) {
  // Hanya handle request GET
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(function(networkRes) {
        // Simpan response terbaru ke cache
        var resClone = networkRes.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, resClone);
        });
        return networkRes;
      })
      .catch(function() {
        // Offline: ambil dari cache
        return caches.match(e.request).then(function(cached) {
          if (cached) return cached;
          // Kalau tidak ada di cache, tampilkan index.html (dengan overlay offline)
          return caches.match('/Future-Sakato-Dynamics/index.html');
        });
      })
  );
});
