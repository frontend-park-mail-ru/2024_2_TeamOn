const CACHE_NAME = "cache-v1";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/src/index.js",
  //"/src/auth/loginView.js",
  //"/src/auth/signupView.js",
  "/src/pages/home.js",
  //"/src/pages/feed/feedView.js",
  //"/src/pages/notification/notification.js",
  //"/src/pages/profile/profileView.js",
  //"/src/pages/settingsView.js",
  //"/styles/style.css",
];

self.addEventListener("install", (event: any) => {
  console.log("Service Worker installing");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching resources:", CACHE_URLS);
        return cache.addAll(CACHE_URLS);
      })
      .catch((error) => {
        console.error("Error caching resources:", error);
      }),
  );
});

self.addEventListener("activate", (event: any) => {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});

self.addEventListener("fetch", (event: any) => {
  console.log("Trying to fetch:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Serving from cache:", event.request.url);
        return cachedResponse;
      }

      console.log("Fetching from network:", event.request.url);
      return fetch(event.request)
        .then((response) => {
          console.log("Network response status:", response.status);
          if (!response.ok) {
            console.warn("Network response not ok:", response.status);
            return new Response("Failed to load resource");
          }
          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          return new Response("Offline and not cached");
        });
    }),
  );
});

/*
fetch("/index.html").then((response) => {
  if (response.ok) {
    response.text().then((text) => console.log("Content:", text));
  } else {
    console.error("Fetch error:", response.status);
  }
});
*/
