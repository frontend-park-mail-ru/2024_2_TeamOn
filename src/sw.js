const CACHE_NAME = "cache-v1";
const CACHE_URLS = [
  "/",
];

self.addEventListener("install", (event) => {
    console.log("Installed");
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Cashed:", CACHE_URLS);
        return cache.addAll(CACHE_URLS);
      })
    );
    self.skipWaiting(); 
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Activated");
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName))
        )
      )
    );
    self.clients.claim(); 
  });
  

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          console.log("Status:", response.status);
          if (!response.ok) {
            console.warn("Network response not ok:", response.status);
            return new Response("Failed to load resource");
          }
          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          return new Response("not cached");
        });
    }),
  );
});


