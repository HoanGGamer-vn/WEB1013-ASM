// Service Worker for Error404 PWA
const CACHE_NAME = 'error404-pwa-v1.0.0'
const STATIC_CACHE_NAME = 'error404-static-v1'
const DYNAMIC_CACHE_NAME = 'error404-dynamic-v1'

// Determine base path dynamically (so service worker works under GitHub Pages subpath)
const BASE_PATH = (() => {
  try {
    // registration.scope ends with a trailing slash
    const scope = (self.registration && self.registration.scope) ? new URL(self.registration.scope).pathname : '/'
    return scope
  } catch (e) {
    return '/'
  }
})()

// Files to cache immediately (prefix with BASE_PATH)
const STATIC_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'src/main.ts',
  BASE_PATH + 'src/App.vue',
  BASE_PATH + 'src/assets/main.css',
  BASE_PATH + 'icons/icon-192x192.png',
  BASE_PATH + 'icons/icon-512x512.png',
  // Core pages
  BASE_PATH + 'news',
  BASE_PATH + 'characters', 
  BASE_PATH + 'world',
  BASE_PATH + 'story'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/',
  '/data/'
]

// Images and media to cache
const MEDIA_CACHE_PATTERNS = [
  BASE_PATH + 'images/',
  BASE_PATH + 'audio/',
  BASE_PATH + 'video/'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  if (self.location.hostname === 'localhost') {
    console.log('[SW] Installing service worker...')
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      if (self.location.hostname === 'localhost') {
        console.log('[SW] Caching static assets')
      }
      return cache.addAll(STATIC_ASSETS)
    }).catch((error) => {
      console.error('[SW] Failed to cache static assets:', error)
    })
  )
  
  // Force activation of new service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Take control of all clients
  event.waitUntil(self.clients.claim())
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
  } else if (isMediaRequest(request)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
  }
})

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error)
    return getOfflineFallback(request)
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return getOfflineFallback(request)
  }
}

// Helper functions
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.url.includes('.css') ||
         request.url.includes('.js') ||
         request.url.includes('.woff') ||
         request.url.includes('.woff2')
}

function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => request.url.includes(pattern))
}

function isMediaRequest(request) {
  return MEDIA_CACHE_PATTERNS.some(pattern => request.url.includes(pattern)) ||
         request.url.includes('.jpg') ||
         request.url.includes('.jpeg') ||
         request.url.includes('.png') ||
         request.url.includes('.webp') ||
         request.url.includes('.svg') ||
         request.url.includes('.mp3') ||
         request.url.includes('.mp4')
}

async function getOfflineFallback(request) {
  const url = new URL(request.url)
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match(BASE_PATH + 'offline.html')
    if (offlinePage) {
      return offlinePage
    }
    // Fallback to cached index
    return caches.match(BASE_PATH)
  }
  
  // Return offline image for image requests
  if (request.destination === 'image') {
    return caches.match(BASE_PATH + 'images/offline-placeholder.png')
  }
  
  // Return basic offline response
  return new Response('Offline - Content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Retry failed requests when back online
  console.log('[SW] Performing background sync')
  // Implementation for retrying failed API calls, form submissions, etc.
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Error404 - Wuthering Waves', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    )
  }
})

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    })
  }
})

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'news-sync') {
    event.waitUntil(syncLatestNews())
  }
})

async function syncLatestNews() {
  try {
    console.log('[SW] Syncing latest news in background')
    const response = await fetch('/api/news/latest')
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put('/api/news/latest', response)
    }
  } catch (error) {
    console.error('[SW] Failed to sync news:', error)
  }
}