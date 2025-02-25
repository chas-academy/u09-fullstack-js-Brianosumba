// public/service-worker.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache API calls - "NetworkFirst" ensures fresh data when online, fallback to cache when offline
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Store only the latest 50 API responses
        maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day
      }),
    ],
  })
);

// Cache images using "CacheFirst" strategy
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // Cache images for 7 days
      }),
    ],
  })
);

// Listen for "sync" event to retry failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

// Function to process queued requests
async function syncRequests() {
  const queue = (await idbKeyval.get("offline-requests")) || [];
  while (queue.length > 0) {
    const request = queue.shift();
    try {
      await fetch(request.url, request.options);
    } catch (err) {
      console.error("Sync failed:", err);
      return;
    }
  }
  await idbKeyval.set("offline-requests", []);
}

console.log("Service worker registered successfully!");
