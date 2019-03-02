workbox.skipWaiting();
workbox.clientsClaim();

const FETCH_QUEUE_NAME = 'fetchQueue';
const FETCH_CACHE_NAME = 'fetchCache';

const fetchQueue = new workbox.backgroundSync.Queue(FETCH_QUEUE_NAME);

self.addEventListener('fetch', (event) => {
    if (/\/api\//.test(event.request.url)) {
        if (event.request.method !== 'GET') {
            // Queue non-GET requests.
            const promiseChain = fetch(event.request.clone()).catch((err) => {
                return fetchQueue.addRequest(event.request);
            });

            event.waitUntil(promiseChain);
        } else {
            // Handle GET requests with the network-first strategy.
            event.respondWith(
                fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || !/basic|cors/.test(response.type)) {
                        return response;
                    }

                    const responseToCache = response.clone();

                    // Cache the response.
                    caches.open(FETCH_CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                    return caches.match(event.request);
                })
            );
        }
    }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);