// Service Worker for Web Stories Player
const CACHE_NAME = 'webstories-player-v1.0.0';
const API_CACHE = 'webstories-api-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened player cache');
          return cache.addAll(urlsToCache);
        }),
      caches.open(API_CACHE)
        .then(function(cache) {
          console.log('Opened API cache');
          // We'll cache API responses as they come
        })
    ])
  );
  self.skipWaiting();
});

// Fetch event with network-first strategy for API, cache-first for assets
self.addEventListener('fetch', function(event) {
  const request = event.request;
  
  // API requests - network first, then cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          // Cache successful API responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(API_CACHE)
              .then(function(cache) {
                cache.put(request, responseToCache);
              });
          }
          return response;
        })
        .catch(function() {
          // If network fails, try cache
          return caches.match(request);
        })
    );
  } else {
    // Static assets - cache first, then network
    event.respondWith(
      caches.match(request)
        .then(function(response) {
          return response || fetch(request);
        })
    );
  }
});

// Activate event - cleanup old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (![CACHE_NAME, API_CACHE].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync tasks here
  }
});