import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { get, set } from "idb-keyval";

//  **Precache Static Assets**
precacheAndRoute(self.__WB_MANIFEST || []);

//  **Cache API Calls (NetworkFirst)**
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

//  **Cache Images (CacheFirst)**
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

//  **Background Sync for Offline Registrations**
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-registrations") {
    console.log("Sync event triggered: Syncing offline registrations...");
    event.waitUntil(syncRegistrations());
  }
});

//  **Function to Sync Offline Registrations**
async function syncRegistrations() {
  const offlineQueue = (await get("offline-registrations")) || [];

  if (offlineQueue.length === 0) return;

  console.log(`Syncing ${offlineQueue.length} offline registrations...`);

  for (const userData of offlineQueue) {
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Failed to sync registration:", error);
      return; // Stop processing if network is still unavailable
    }
  }

  await set("offline-registrations", []); // Clear queue after successful sync
}

console.log(" Service Worker Registered Successfully!");
