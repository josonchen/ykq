const CACHE_NAME = 'home-items-v6-ocr-idb';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  // 新增：Tesseract 核心库
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  // 注意：Tesseract 在运行时会动态请求 worker.min.js 和 中文语言包
  // 如果要完全离线 OCR，需要用户在联网时使用过一次 OCR 功能，
  // 浏览器会自动将这些动态请求缓存到默认的 Cache Storage 中。
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});