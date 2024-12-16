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

  // Массив путей, которые не нужно кэшировать
  const noCachePaths = [
    "/token-endpoint",
    "/api/accounts/account",
    "/api/accounts/notification",
    "/api/pages/stat/posts?time=day",
    "/api/pages/stat/posts?time=month",
    "/api/pages/stat/posts?time=year",
    "/api/pages/stat/payments?time=day",
    "/api/pages/stat/payments?time=month",
    "/api/pages/stat/payments?time=year",
    "/bundle.js",
    "/notification/new",
    "/notification",
    "/notification/new?time=10",
    "/notification?status=NOTREAD",
    "/notification?offset=0&limit=10&status=NOTREAD",
    "/notification?offset=10&limit=10&status=NOTREAD",
    "/notification?offset=20&limit=10&status=NOTREAD",
    "/notification?offset=30&limit=10&status=NOTREAD",
    "/notification?offset=40&limit=10",
    "/notification?offset=0&limit=10",
    "/notification?offset=10&limit=10",
    "/notification?offset=20&limit=10",
    "/notification?offset=30&limit=10",
    "/notification?offset=40&limit=10",
    "/api/posts/author/post/me?limit=300&offset=0",
    "/api/accounts/notification?offset=0&limit=10",
    "/api/pages/author/me",
    "/api/tech/subscription/me/custom",
  ];
  const cachePaths = [
    "/close.png",
    "/left-arrow.png",
    "/right-arrow.png",
    "/pushback.png",
    "/addsubs.png",
    "/icon_edit.png",
    "/icon_home.png",
    "/icon_notification.png",
    "/readNotif.png",
    "/notificationClear.png",
    "/icon_settings.png",
    "/icon_profile.png",
    "/police.png",
    "/icon_like.png",
    "/icon_comment.png",
    "/paperclip.png",
    "/closefile.png",
    "/fon.png",
    "/human.jpg",
    "/login.png",
    "/signup.png",
    "/eye_see.png",
    "/eye_nsee.png",
    "/forward.png",
    "/sendblue.png",
    "/volume.png",
    "/volumeStop.png",
    "/shar.png",
    "/playArrow.png",
    "/stopArrow.png",
    "/penEdit.png",
    "/deleteComm.png",
    "/sad.png",
    "/blocked.png",
    "/published.png",
    "/clearSubs.png",
    "/notificationNRead.png",
    "/fav.png",
  ];

  const shouldBypassCache = cachePaths.some((path) =>
    event.request.url.endsWith(path),
  );
  if (event.request.method === "GET") {
    if (shouldBypassCache) {
      // Обрабатываем кэширование для всех остальных запросов
      event.respondWith(
        caches
          .match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log("Returning cached response for:", event.request.url);
              return cachedResponse;
            }

            // Если кэшированного ответа нет, выполняем сетевой запрос
            return fetch(event.request).then((response) => {
              console.log("Status:", response.status);
              if (!response.ok) {
                console.warn("Network response not ok:", response.status);
                return response;
              }

              // Кэшируем ответ для будущих запросов
              return caches.open("pushart-cache").then((cache) => {
                cache.put(event.request, response.clone());
                console.log("Caching new response:", event.request.url);
                return response;
              });
            });
          })
          .catch((error) => {
            console.error("Fetch failed:", error);
            throw error;
          }),
      );
    }
  }
});
