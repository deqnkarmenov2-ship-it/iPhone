const CACHE_NAME = 'resto-calculator-v3'; // <-- КРИТИЧНА ПРОМЯНА: v3
// Файловете, които искаме да кешираме:
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png'
];

// Инсталация: Кеширане на всички ресурси
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеширане на файловете...');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Принуждава Service Worker да стане активен веднага
});

// Активация: Изтриване на стари кешове
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Изтриване на стар кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Изтегляне (Fetch): Сервиране на съдържанието от кеша, ако е достъпно
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ако има кеширан отговор, го връщаме (Cache-First).
        if (response) {
          return response;
        }
        // В противен случай, опитваме да изтеглим от мрежата.
        return fetch(event.request).catch(function() {
            // Ако няма мрежа (Самолетен режим) и файлът не е в кеша, връщаме index.html като резервен вариант
            return caches.match('index.html');
        });
      })
  );
});