const CACHE = 'gds-farbisa-v2';
const LOCAL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Don't intercept CDN requests — let them go directly to internet
  if(url.includes('cdnjs.cloudflare.com') || url.includes('cdn.jsdelivr.net')){
    e.respondWith(fetch(e.request));
    return;
  }
  // Local files — serve from cache
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
