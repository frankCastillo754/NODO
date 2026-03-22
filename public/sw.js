/**
 * Service worker mínimo para PWA.
 * Permite instalación y futura extensión (offline, push).
 * En install: skipWaiting para activar nueva versión; opcional claim().
 */
self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})
