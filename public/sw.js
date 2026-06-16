const CACHE_NAME = 'water-bets-v3'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  const isNavigationRequest =
    event.request.mode === 'navigate' ||
    (event.request.destination === 'document' && requestUrl.origin === self.location.origin)

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone()
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(event.request)
          if (cached) return cached
          return caches.match('/index.html')
        }),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response
        }
        const cloned = response.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
        return response
      })
    }),
  )
})
