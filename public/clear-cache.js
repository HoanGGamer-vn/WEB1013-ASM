// Clear Service Worker and Cache Tool
// Run this in browser console to clear all caches

async function clearAllCaches() {
  try {
    console.log('🧹 Clearing all caches...')
    
    // 1. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      console.log(`Found ${registrations.length} service worker registrations`)
      
      for (const registration of registrations) {
        console.log('Unregistering:', registration.scope)
        await registration.unregister()
      }
      console.log('✅ All service workers unregistered')
    }
    
    // 2. Clear all caches
    const cacheNames = await caches.keys()
    console.log(`Found ${cacheNames.length} caches:`, cacheNames)
    
    for (const cacheName of cacheNames) {
      console.log('Deleting cache:', cacheName)
      await caches.delete(cacheName)
    }
    console.log('✅ All caches cleared')
    
    // 3. Clear localStorage and sessionStorage
    localStorage.clear()
    sessionStorage.clear()
    console.log('✅ Storage cleared')
    
    console.log('🎉 All caches and storage cleared! Please refresh the page.')
    return true
    
  } catch (error) {
    console.error('❌ Failed to clear caches:', error)
    return false
  }
}

// Auto-run if in development
if (window.location.hostname === 'localhost') {
  console.log('🔧 Development mode detected')
  console.log('💡 Run clearAllCaches() to clear all caches')
  console.log('💡 Or add ?nocache=1 to URL to bypass service worker')
}

// Export for manual use
window.clearAllCaches = clearAllCaches