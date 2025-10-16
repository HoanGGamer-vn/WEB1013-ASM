<template>
  <div class="lazy-image-container" :class="containerClass">
    <img
      :src="placeholderSrc || defaultPlaceholder"
      :data-src="src"
      :alt="alt"
      :class="['lazy-image', { 'loaded': isLoaded, 'loading': isLoading }]"
      :width="width"
      :height="height"
      ref="imageRef"
      @load="onLoad"
      @error="onError"
      :loading="eager ? 'eager' : 'lazy'"
    />
    
    <!-- Loading overlay -->
    <div v-if="isLoading && showLoader" class="image-loader">
      <div class="loader-spinner"></div>
    </div>
    
    <!-- Error state -->
    <div v-if="hasError" class="image-error" @click="retry">
      <div class="error-content">
        <span class="error-icon">📷</span>
        <p class="error-text">Không thể tải ảnh</p>
        <button class="retry-btn" aria-label="Thử lại tải ảnh">Thử lại</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  placeholderSrc?: string
  containerClass?: string
  eager?: boolean
  showLoader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  eager: false,
  showLoader: true
})

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
const observer = ref<IntersectionObserver>()

const defaultPlaceholder = 'data:image/svg+xml,%3Csvg width="400" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280"%3ELoading...%3C/text%3E%3C/svg%3E'

const loadImage = () => {
  if (!imageRef.value || isLoaded.value || hasError.value) return

  isLoading.value = true
  hasError.value = false

  const img = new Image()
  
  img.onload = () => {
    if (imageRef.value) {
      imageRef.value.src = props.src
    }
  }
  
  img.onerror = () => {
    hasError.value = true
    isLoading.value = false
  }
  
  img.src = props.src
}

const onLoad = () => {
  isLoaded.value = true
  isLoading.value = false
  hasError.value = false
}

const onError = () => {
  hasError.value = true
  isLoading.value = false
}

const retry = () => {
  hasError.value = false
  loadImage()
}

onMounted(() => {
  if (props.eager) {
    loadImage()
    return
  }

  // Intersection Observer for lazy loading
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer.value?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px'
    }
  )

  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: #f3f4f6;
}

.lazy-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease, filter 0.3s ease;
  opacity: 0;
  filter: blur(5px);
}

.lazy-image.loaded {
  opacity: 1;
  filter: blur(0);
}

.lazy-image.loading {
  opacity: 0.7;
  filter: blur(2px);
}

.image-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(196, 172, 125, 0.3);
  border-top: 3px solid #c4ac7d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  cursor: pointer;
}

.error-content {
  text-align: center;
  padding: 1rem;
}

.error-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.error-text {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #d1d5db;
}

.retry-btn {
  background: #c4ac7d;
  color: #1a1a1a;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #d4c190;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .loader-spinner {
    width: 32px;
    height: 32px;
  }
  
  .error-icon {
    font-size: 1.5rem;
  }
  
  .retry-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>