<template>
  <div class="error-boundary">
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">{{ title }}</h2>
      <p class="error-message">{{ message }}</p>
      
      <div class="error-actions">
        <button @click="retry" class="retry-btn" v-if="showRetry">
          🔄 Thử lại
        </button>
        <button @click="goHome" class="home-btn">
          🏠 Về trang chủ
        </button>
      </div>
      
      <details class="error-details" v-if="showDetails && errorDetails">
        <summary>Chi tiết lỗi</summary>
        <pre class="error-code">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  message?: string
  errorDetails?: string | Error
  showRetry?: boolean
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Oops! Đã có lỗi xảy ra',
  message: 'Chúng tôi đang gặp một số vấn đề kỹ thuật. Vui lòng thử lại sau.',
  showRetry: true,
  showDetails: false
})

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()

const retry = () => {
  emit('retry')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-boundary {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.error-message {
  color: #d1d5db;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.retry-btn,
.home-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.retry-btn {
  background: #10b981;
  color: white;
}

.retry-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.home-btn {
  background: rgba(196, 172, 125, 0.2);
  color: #c4ac7d;
  border: 1px solid #c4ac7d;
}

.home-btn:hover {
  background: #c4ac7d;
  color: #1a1a1a;
  transform: translateY(-2px);
}

.error-details {
  text-align: left;
  margin-top: 2rem;
}

.error-details summary {
  color: #c4ac7d;
  cursor: pointer;
  margin-bottom: 1rem;
}

.error-code {
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .error-container {
    padding: 1.5rem;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .retry-btn,
  .home-btn {
    width: 100%;
  }
}
</style>