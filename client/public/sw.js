// Service Worker for KimScript PWA
const CACHE_NAME = 'kimscript-v1.0.0';
const STATIC_CACHE = 'kimscript-static-v1.0.0';
const DYNAMIC_CACHE = 'kimscript-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/scripts/,
  /\/api\/analytics/,
  /\/api\/health/,
  /\/api\/diagnostic/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  if (url.origin === location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle external requests (images, fonts, etc.)
  event.respondWith(handleExternalRequest(request));
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API endpoint should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (!shouldCache) {
    return fetch(request);
  }

  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for:', url.pathname);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No internet connection. Please check your connection and try again.' 
      }),
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static files with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first for static files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for future use
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for static file:', request.url);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return a basic offline response
    return new Response(
      '<html><body><h1>Offline</h1><p>No internet connection. Please check your connection and try again.</p></body></html>',
      { 
        status: 200, 
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Handle external requests (images, fonts, etc.)
async function handleExternalRequest(request) {
  try {
    // Try network first for external resources
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache external resources
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache for external resources
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a placeholder for failed external resources
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Image unavailable</text></svg>',
        { 
          status: 200, 
          statusText: 'OK',
          headers: { 'Content-Type': 'image/svg+xml' }
        }
      );
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de KimScript',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('KimScript', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync implementation
async function doBackgroundSync() {
  console.log('Performing background sync...');
  
  try {
    // Sync any pending offline actions
    // This would typically involve syncing cached data with the server
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

async function doPeriodicSync() {
  console.log('Performing periodic sync...');
  
  try {
    // Sync content periodically
    console.log('Periodic sync completed');
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}
