const CACHE_NAME = 'cyber-marx-ar-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './ar-camera.html',
  './manifest.json',
  './icon.png',
  './assets/cyber_marx.jpg',
  './assets/comic_page1.jpg',
  './assets/comic_page2.jpg',
  './assets/targets.mind'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => fetch(event.request))
  );
});
