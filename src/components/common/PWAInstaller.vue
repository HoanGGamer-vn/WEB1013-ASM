<template>
  <Transition name="install-prompt">
    <div v-if="showInstallPrompt" class="install-prompt-container">
      <div class="install-prompt" role="dialog" aria-labelledby="install-title" aria-describedby="install-description">
        <button class="close-btn" @click="dismissPrompt" :aria-label="$t('common.close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        
        <div class="install-content">
          <div class="install-icon">
            <img src="/icons/icon.svg" alt="Error404 App Icon" />
          </div>
          
          <div class="install-text">
            <h3 id="install-title">{{ $t('pwa.installTitle') }}</h3>
            <p id="install-description">{{ $t('pwa.installDescription') }}</p>
            
            <div class="install-features">
              <div class="feature">
                <span class="feature-icon">⚡</span>
                <span>{{ $t('pwa.feature.fast') }}</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📱</span>
                <span>{{ $t('pwa.feature.mobile') }}</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔔</span>
                <span>{{ $t('pwa.feature.notifications') }}</span>
              </div>
            </div>
          </div>
          
          <div class="install-actions">
            <button class="install-btn" @click="installApp">
              {{ $t('pwa.install') }}
            </button>
            <button class="later-btn" @click="dismissPrompt">
              {{ $t('pwa.later') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Update notification -->
  <Transition name="update-notification">
    <div v-if="showUpdateNotification" class="update-notification">
      <div class="update-content">
        <span class="update-icon">🔄</span>
        <div class="update-text">
          <strong>{{ $t('pwa.updateAvailable') }}</strong>
          <p>{{ $t('pwa.updateDescription') }}</p>
        </div>
        <div class="update-actions">
          <button class="update-btn" @click="updateApp">
            {{ $t('pwa.update') }}
          </button>
          <button class="dismiss-btn" @click="dismissUpdate">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Simplified for TypeScript compatibility
interface BeforeInstallPromptEvent {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  preventDefault(): void
}

const { t } = useI18n()

// State
const showInstallPrompt = ref(false)
const showUpdateNotification = ref(false)
const deferredPrompt = ref<any>(null)
const registration = ref<ServiceWorkerRegistration | null>(null)

// PWA Installation
const handleBeforeInstallPrompt = (e: any) => {
  e.preventDefault()
  deferredPrompt.value = e
  
  // Don't show if already dismissed today
  const dismissedToday = localStorage.getItem('install-dismissed-date')
  const today = new Date().toDateString()
  
  if (dismissedToday !== today) {
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000) // Show after 3 seconds
  }
}

const installApp = async () => {
  if (!deferredPrompt.value) return
  
  showInstallPrompt.value = false
  
  try {
    await deferredPrompt.value.prompt()
    const choiceResult = await deferredPrompt.value.userChoice
    
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA installed successfully')
      // Track installation
      trackEvent('pwa_installed')
    }
  } catch (error) {
    console.error('Error installing PWA:', error)
  } finally {
    deferredPrompt.value = null
  }
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  // Remember dismissal for today
  localStorage.setItem('install-dismissed-date', new Date().toDateString())
  deferredPrompt.value = null
}

// Service Worker Updates
const checkForUpdates = async () => {
  if ('serviceWorker' in navigator && registration.value) {
    try {
      await registration.value.update()
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }
}

const updateApp = () => {
  if (registration.value && registration.value.waiting) {
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    showUpdateNotification.value = false
    
    // Reload page to apply update
    window.location.reload()
  }
}

const dismissUpdate = () => {
  showUpdateNotification.value = false
}

// Service Worker Registration
const registerServiceWorker = async () => {
  // Disable service worker in development to avoid caching issues
  if (import.meta.env.DEV) {
    console.log('[PWA] Service Worker disabled in development mode')
    return
  }
  
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      registration.value = reg
      
      console.log('Service Worker registered successfully')
      
      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification.value = true
            }
          })
        }
      })
      
      // Check for updates every 30 minutes
      setInterval(checkForUpdates, 30 * 60 * 1000)
      
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Push Notifications
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Notification permission granted')
      // In production, you would subscribe to push notifications here
      // subscribeToNotifications()
    }
  }
}

// Utilities
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const trackEvent = (eventName: string, properties?: any) => {
  // Analytics tracking
  if (window.gtag) {
    window.gtag('event', eventName, properties)
  }
  
  // Custom event for other tracking systems
  window.dispatchEvent(new CustomEvent('pwa-event', {
    detail: { event: eventName, properties }
  }))
}

// Network status
const handleOnline = () => {
  console.log('App is online')
  // Sync any pending data
}

const handleOffline = () => {
  console.log('App is offline')
  // Show offline indicator
}

// Lifecycle
onMounted(async () => {
  // Register service worker
  await registerServiceWorker()
  
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  
  // Network status listeners
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Request notification permission after user interaction
  setTimeout(requestNotificationPermission, 5000)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.install-prompt-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.install-prompt {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(196, 172, 125, 0.1);
  color: #c4ac7d;
}

.install-content {
  text-align: center;
}

.install-icon {
  margin-bottom: 1.5rem;
}

.install-icon img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(196, 172, 125, 0.3);
}

.install-text h3 {
  color: #c4ac7d;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.install-text p {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.install-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  text-align: left;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e5e7eb;
  font-size: 0.875rem;
}

.feature-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.install-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.install-btn {
  background: linear-gradient(45deg, #c4ac7d, #d4c190);
  color: #1a1a1a;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.install-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(196, 172, 125, 0.4);
}

.later-btn {
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.later-btn:hover {
  border-color: #9ca3af;
  color: #d1d5db;
}

.update-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 12px;
  padding: 1rem;
  max-width: 350px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.update-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.update-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.update-text {
  flex: 1;
  min-width: 0;
}

.update-text strong {
  color: #c4ac7d;
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.25rem;
}

.update-text p {
  color: #d1d5db;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
}

.update-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.update-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.update-btn:hover {
  background: #059669;
}

.dismiss-btn {
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dismiss-btn:hover {
  border-color: #9ca3af;
  color: #d1d5db;
}

/* Animations */
.install-prompt-enter-active,
.install-prompt-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.install-prompt-enter-from,
.install-prompt-leave-to {
  opacity: 0;
}

.install-prompt-enter-from .install-prompt,
.install-prompt-leave-to .install-prompt {
  transform: scale(0.95) translateY(20px);
}

.update-notification-enter-active,
.update-notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.update-notification-enter-from,
.update-notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .install-prompt {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .install-features {
    flex-direction: column;
  }
  
  .update-notification {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .update-content {
    flex-direction: column;
    text-align: center;
  }
  
  .update-actions {
    justify-content: center;
  }
}
</style>