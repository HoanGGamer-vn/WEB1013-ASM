<template>
  <Transition name="network-status">
    <div v-if="showStatus" class="network-status" :class="statusClass">
      <div class="status-content">
        <div class="status-icon">
          <svg v-if="isOnline" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div class="status-text">
          <div class="status-title">{{ statusTitle }}</div>
          <div class="status-message">{{ statusMessage }}</div>
        </div>
        <button v-if="!isOnline" @click="retry" class="retry-btn">
          Retry
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const isOnline = ref(navigator.onLine)
const showStatus = ref(false)
const lastStatusChange = ref(Date.now())

// Computed
const statusClass = computed(() => ({
  'online': isOnline.value,
  'offline': !isOnline.value
}))

const statusTitle = computed(() => 
  isOnline.value ? 'Back Online' : 'No Internet Connection'
)

const statusMessage = computed(() => 
  isOnline.value 
    ? 'Your connection has been restored'
    : 'Please check your internet connection'
)

// Methods
const updateOnlineStatus = () => {
  const newStatus = navigator.onLine
  if (newStatus !== isOnline.value) {
    isOnline.value = newStatus
    showStatus.value = true
    lastStatusChange.value = Date.now()
    
    // Auto hide after 3 seconds if online
    if (newStatus) {
      setTimeout(() => {
        showStatus.value = false
      }, 3000)
    }
    
    console.log(`🌐 Network status changed: ${newStatus ? 'Online' : 'Offline'}`)
  }
}

const retry = () => {
  window.location.reload()
}

const hideStatus = () => {
  showStatus.value = false
}

// Event listeners
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Show initial status if offline
  if (!isOnline.value) {
    showStatus.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.network-status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  min-width: 300px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.network-status.online {
  background: rgba(34, 197, 94, 0.9);
}

.network-status.offline {
  background: rgba(239, 68, 68, 0.9);
}

.status-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  flex-shrink: 0;
}

.status-icon svg {
  stroke: currentColor;
  stroke-width: 2;
}

.status-text {
  flex: 1;
}

.status-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.status-message {
  font-size: 12px;
  opacity: 0.8;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Transitions */
.network-status-enter-active,
.network-status-leave-active {
  transition: all 0.3s ease;
}

.network-status-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.network-status-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>