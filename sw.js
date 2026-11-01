/* ARAL Gain Tracker: lets the app reopen without signal. Always asks the network first, so updates arrive as soon as there is signal. */
const CACHE = 'aral-gain-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html'])).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; /* never touch calls to Google Sheets */
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
    .catch(() => caches.match(req).then(r => r || caches.match('index.html') || caches.match('./'))));
});
