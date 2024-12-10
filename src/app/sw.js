const CACHE_NAME = "cache-v1";
const CACHE_URL = ["/"];
const URLS_TO_CACHE = [...CACHE_URL];

self.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cached:", URLS_TO_CACHE);
      return cache.addAll(URLS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Activated");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  if (event.request.method === "GET") {
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
            }
            return response;
          })
          .catch((error) => {
            console.error("Fetch failed:", error);
          });
      }),
    );
  }
});
