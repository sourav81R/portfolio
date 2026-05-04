const CACHE_NAME = 'sourav-portfolio-v4'
const APP_SHELL = ['manifest.webmanifest', 'portfolio-icon.svg']
const scopeUrl = new URL(self.registration.scope)
const scopePath = scopeUrl.pathname.endsWith('/') ? scopeUrl.pathname : `${scopeUrl.pathname}/`

const resolveScopedUrl = (path = '') => new URL(path, self.registration.scope).toString()
const isNavigationRequest = (request) =>
  request.mode === 'navigate' || request.destination === 'document'

const isSameScopeRequest = (url) =>
  url.origin === self.location.origin && url.pathname.startsWith(scopePath)

const isStaticAssetRequest = (request) => {
  if (request.method !== 'GET') return false

  const url = new URL(request.url)
  if (!isSameScopeRequest(url) || isNavigationRequest(request)) return false

  return (
    ['script', 'style', 'worker', 'image', 'font'].includes(request.destination) ||
    url.pathname.startsWith(`${scopePath}assets/`) ||
    APP_SHELL.some((asset) => url.pathname === new URL(asset, self.registration.scope).pathname)
  )
}

const cacheResponse = async (request, response) => {
  if (!response.ok || response.type === 'opaque') return response

  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response.clone())
  return response
}

self.addEventListener('install', (event) => {
  const precacheUrls = APP_SHELL.map((path) => resolveScopedUrl(path))

  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(precacheUrls)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (!isSameScopeRequest(url) || request.method !== 'GET') return

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME)
          return cache.match(request) || cache.match(resolveScopedUrl())
        })
    )
    return
  }

  if (!isStaticAssetRequest(request)) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => cached)

      return cached || networkFetch
    })
  )
})
