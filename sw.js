const currentCacheVersion = 'mws-restaurant-v1';
const imagesToCache = [
  '/img/1.webp',
  '/img/2.webp',
  '/img/3.webp',
  '/img/4.webp',
  '/img/5.webp',
  '/img/6.webp',
  '/img/7.webp',
  '/img/8.webp',
  '/img/9.webp',
  '/img/10.webp',
  '/img/1_400.webp',
  '/img/2_400.webp',
  '/img/3_400.webp',
  '/img/4_400.webp',
  '/img/5_400.webp',
  '/img/6_400.webp',
  '/img/7_400.webp',
  '/img/8_400.webp',
  '/img/9_400.webp',
  '/img/10_400.webp',
  '/img/1_800.webp',
  '/img/2_800.webp',
  '/img/3_800.webp',
  '/img/4_800.webp',
  '/img/5_800.webp',
  '/img/6_800.webp',
  '/img/7_800.webp',
  '/img/8_800.webp',
  '/img/9_800.webp',
  '/img/10_800.webp',
  ];

const resourcesToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/idb.js',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  ...imagesToCache
];

// Install SW
self.addEventListener('install', event => {
  // Cache the resources
  // instead of aggressively caching all images, since we have 6 variations of each image, I'd only cache them as they come as requests in the SW's fetch event
  event.waitUntil(
    caches.open(currentCacheVersion).then(cache => {
      return cache.addAll(resourcesToCache);
    })
  );
});

// SW activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Delete all other versions of the 'mws-restaurant' cache except for the current one
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith('mws-restaurant') &&
              currentCacheVersion != cacheName
            );
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// SW Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(currentCacheVersion).then(cache => {
      return cache.match(event.request).then(response => {
        // Return response from cache if one exists
        if (response) return response;

        // Otherwise hit the network
        return fetch(event.request).then(netResponse => {
          // Only cache images from the app
          if (
            netResponse.url.includes('.jpg') ||
            netResponse.url.includes('.webp')
          ) {
            if (netResponse.url.includes(window.location.origin)) {
              cache.put(event.request.url, netResponse.clone());
              return netResponse;
            }
            return;
          }
          console.log(netResponse);
          cache.put(event.request.url, netResponse.clone());
          return netResponse;
        });
      });
    })
  );
});
