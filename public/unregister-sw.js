// Script to unregister existing service workers
// Run this in browser console to clear all service workers

const unregisterAllServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      
      if (location.hostname === 'localhost') {
        console.log('Found', registrations.length, 'service worker registrations')
      }
      
      for (const registration of registrations) {
        if (location.hostname === 'localhost') {
          console.log('Unregistering service worker:', registration.scope)
        }
        await registration.unregister()
      }
      
      if (location.hostname === 'localhost') {
        console.log('✅ All service workers unregistered')
      }
      
      // Clear caches
      const cacheNames = await caches.keys()
      if (location.hostname === 'localhost') {
        console.log('Found', cacheNames.length, 'caches')
      }
      
      for (const cacheName of cacheNames) {
        console.log('Deleting cache:', cacheName)
        await caches.delete(cacheName)
      }
      
      console.log('✅ All caches cleared')
      
      // Clear storage
      localStorage.clear()
      sessionStorage.clear()
      
      console.log('✅ Storage cleared')
      
      alert('Service Workers and caches cleared! Reload the page.')
      
    } catch (error) {
      console.error('Failed to unregister service workers:', error)
    }
  } else {
    console.log('Service Workers not supported')
  }
}

// Run immediately
unregisterAllServiceWorkers()