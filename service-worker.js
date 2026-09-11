const CACHE_NAME = "vietnam-shopping-v21";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=21",
  "./app.js?v=21",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./assets/denominations/500000.jpg",
  "./assets/denominations/200000.jpg",
  "./assets/denominations/100000.jpg",
  "./assets/denominations/50000.jpg",
  "./assets/denominations/20000.jpg",
  "./assets/denominations/10000.jpg",
  "./assets/denominations/5000.jpg",
  "./assets/denominations/2000.jpg",
  "./assets/denominations/1000.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        return networkResponse;
      });
    }),
  );
});
