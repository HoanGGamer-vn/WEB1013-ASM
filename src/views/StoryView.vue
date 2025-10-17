<template>
  <div class="story-view" role="main">
    <!-- Particle Effects Background -->
    <div class="particles-container" aria-hidden="true">
      <div class="particle" v-for="n in 15" :key="`particle-${n}`" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- Floating Elements -->
    <div class="floating-elements" aria-hidden="true">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay" aria-hidden="true">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading stories...</p>
    </div>

    <div class="story-container">
      <!-- Story Controls -->
      <div class="story-controls">
        <button 
          class="control-btn"
          @click="toggleAutoPlay"
          :aria-label="autoPlayEnabled ? 'Pause auto-play' : 'Start auto-play'"
          :title="autoPlayEnabled ? 'Pause auto-play' : 'Start auto-play'"
        >
          <svg v-if="!autoPlayEnabled" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        
        <div class="keyboard-hint" aria-live="polite">
          <span>Use ← → arrow keys or spacebar</span>
        </div>
      </div>

      <!-- Left Section - Story Info -->
      <div class="story-info">
        <div class="story-icon" role="img" :aria-label="`${currentStory.title} icon`">
          <img 
            :src="currentStory.icon" 
            :alt="`${currentStory.title} story icon`"
            loading="eager"
          />
        </div>
        
        <div class="story-content">
          <h1 class="story-title" id="story-title">{{ currentStory.title }}</h1>
          <p class="story-description" aria-describedby="story-title">{{ currentStory.description }}</p>
        </div>
      </div>

      <!-- Right Section - Image Carousel -->
      <div class="story-gallery" role="region" aria-label="Story image gallery">
        <div class="gallery-content">
          <button 
            class="carousel-btn prev" 
            @click="previousImage"
            :disabled="isTransitioning"
            aria-label="Previous story"
            title="Previous story (←)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        
        <div class="image-gallery">
          <!-- Main active image -->
          <div class="main-image" :class="{ 'transitioning': isTransitioning }">
            <img 
              :src="stories[currentIndex].image" 
              :alt="`${stories[currentIndex].title} - Main story image`"
              loading="eager"
              @error="handleImageError"
            />
            <div class="image-loading" v-if="!loadedImages.has(stories[currentIndex].image)">
              <div class="loading-spinner small"></div>
            </div>
          </div>
          
          <!-- Side images swiper -->
          <div class="story-swiper">
            <div class="swiper-wrapper">
              <div 
                v-for="(story, slideIndex) in displayedSideStories" 
                :key="`side-story-${story.originalIndex}`"
                class="swiper-slide side-image"
                :class="getSlideCSSClass(slideIndex)"
                @click="selectStory(story.originalIndex)"
                @keydown.enter="selectStory(story.originalIndex)"
                @keydown.space.prevent="selectStory(story.originalIndex)"
                tabindex="0"
                role="button"
                :aria-label="`View ${story.title} story`"
              >
                <img 
                  :src="story.image" 
                  :alt="`${story.title} preview`"
                  loading="lazy"
                  @error="handleImageError"
                />
                <div class="overlay"></div>
                <div class="story-preview-title">{{ story.title }}</div>
              </div>
            </div>
          </div>
        </div>
        
          <button 
            class="carousel-btn next" 
            @click="nextImage"
            :disabled="isTransitioning"
            aria-label="Next story"
            title="Next story (→)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>

        <!-- Navigation Dots -->
        <div class="navigation-dots" role="tablist" aria-label="Story navigation">
          <button
            v-for="(story, index) in stories"
            :key="`dot-${story.id}`"
            class="nav-dot"
            :class="{ active: index === currentIndex }"
            @click="selectStory(index)"
            :aria-label="`Go to ${story.title}`"
            :aria-selected="index === currentIndex"
            role="tab"
            :tabindex="index === currentIndex ? 0 : -1"
          >
            <span class="dot-indicator"></span>
            <span class="dot-label">{{ story.title }}</span>
          </button>
        </div>
      </div>

      <!-- Progress bar for auto-play -->
      <div v-if="autoPlayEnabled" class="progress-bar" aria-hidden="true">
        <div class="progress-fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { asset } from '@/utils/asset'

const currentIndex = ref(0)
const isTransitioning = ref(false)
const isLoading = ref(true)
const loadedImages = ref(new Set<string>())
const autoPlayEnabled = ref(false)
const autoPlayInterval = ref<NodeJS.Timeout | null>(null)

const stories = ref([
  {
    id: 1,
    title: "Solaris-3",
    description: "Sol-III, the third planet from the sun. A world of chaos and change, where old conventions are discarded and disasters run rampant. Human civilization struggles to survive in this new era of destruction and rebirth, facing uncharted challenges with unwavering determination.",
    image: asset('/images/i-slls-cab62db7.png'),
    thumbnail: asset('/images/demo1.png'),
    icon: asset('/images/icon-01.png')
  },
  {
    id: 2,
    title: "Waveworn Phenomenon",
    description: "The Lament's power causes destructive anomalies, such as the \"Tacet Fields\", \"Tacet Discord Outbreaks\", and the mysterious matter named \"Tacetite\". These are collectively known as the \"Waveworn Phenomena\"",
    image: asset('/images/i-hy-09f3521f.png'), 
    thumbnail: asset('/images/demo2.png'),
    icon: asset('/images/icon-02.png')
  },
  {
    id: 3,
    title: "Lament",
    description: "The term \"Lament\" refers to the ongoing catastrophic events on Solaris-3. Since the first Lament, destruction has been nonstop and unyielding. The tide of devastation continues without pause, with no signs of slowing down.",
    image: asset('/images/i-lament-494f6f60.png'),
    thumbnail: asset('/images/zhezhi-6698177e.png'), 
    icon: asset('/images/icon-03.png')
  },
  {
    id: 4,
    title: "Tacet Field",
    description: "The \"Tacet Fields\" are thought to be where all Tacet Discords originate. These locations feature a sky of inverted seas and a deep cross-shaped Tacet Mark on the ground. Reverberations fill the air, linking our world to an unknown space through a white Resonance Cord. These areas attract gatherings of Tacet Discords.",
    image: asset('/images/i-wyq-c9219c4a.png'),
    thumbnail: asset('/images/changli-3da788f2.png'),
    icon: asset('/images/icon-04.png')
  },
  {
    id: 5,
    title: "Resonator",
    description: "Individuals with the ability to resonate with certain objects and manipulate their frequencies are known as \"Resonators\". These individuals exhibit unique \"Resonance Abilities\", also known as their \"Fortes\", through the \"Tacet Mark\" on their bodies. According to experts, a Resonator's abilities are often influenced by their past experiences and subconscious mind.",
    image: asset('/images/i-gmz-6b5708bb.png'),
    thumbnail: asset('/images/yinlin-9f681990.png'),
    icon: asset('/images/icon-05.png')
  }
])

const currentStory = computed(() => stories.value[currentIndex.value])

// Preload images
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      loadedImages.value.add(src)
      resolve()
    }
    img.onerror = reject
    img.src = src
  })
}

const selectStory = async (index: number) => {
  if (isTransitioning.value || index === currentIndex.value) return
  
  isTransitioning.value = true
  
  // Preload new image if not loaded
  const newStory = stories.value[index]
  if (!loadedImages.value.has(newStory.image)) {
    try {
      await preloadImage(newStory.image)
    } catch (error) {
      console.warn('Failed to preload image:', newStory.image)
    }
  }
  
  currentIndex.value = index
  
  // Allow transition to complete
  setTimeout(() => {
    isTransitioning.value = false
  }, 600)
}

const nextImage = () => {
  const nextIndex = (currentIndex.value + 1) % stories.value.length
  selectStory(nextIndex)
}

const previousImage = () => {
  const prevIndex = (currentIndex.value - 1 + stories.value.length) % stories.value.length
  selectStory(prevIndex)
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
    case ' ': // Spacebar
      event.preventDefault()
      toggleAutoPlay()
      break
    case 'Escape':
      event.preventDefault()
      stopAutoPlay()
      break
  }
}

// Error handling
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Failed to load image:', img.src)
  // You could set a fallback image here
  // img.src = '/images/fallback.png'
}

// Auto-play functionality
const startAutoPlay = () => {
  if (autoPlayInterval.value) return
  
  autoPlayEnabled.value = true
  autoPlayInterval.value = setInterval(() => {
    nextImage()
  }, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
  autoPlayEnabled.value = false
}

const toggleAutoPlay = () => {
  if (autoPlayEnabled.value) {
    stopAutoPlay()
  } else {
    startAutoPlay()
  }
}

// Performance optimizations
const preloadAdjacentImages = async () => {
  const total = stories.value.length
  const prevIndex = (currentIndex.value - 1 + total) % total
  const nextIndex = (currentIndex.value + 1) % total
  
  const imagesToPreload = [
    stories.value[prevIndex].image,
    stories.value[nextIndex].image
  ].filter(src => !loadedImages.value.has(src))
  
  if (imagesToPreload.length > 0) {
    try {
      await Promise.all(imagesToPreload.map(src => preloadImage(src)))
    } catch (error) {
      console.warn('Failed to preload adjacent images')
    }
  }
}

// Watch for current index changes to preload adjacent images
watch(currentIndex, () => {
  preloadAdjacentImages()
})

// Lifecycle
onMounted(async () => {
  // Preload first few images
  try {
    await Promise.all(
      stories.value.slice(0, 3).map(story => preloadImage(story.image))
    )
  } catch (error) {
    console.warn('Failed to preload some images')
  } finally {
    isLoading.value = false
  }
  
  // Add keyboard listeners
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopAutoPlay()
  window.removeEventListener('keydown', handleKeydown)
})

// Swiper logic - hiển thị 1 slide cho side story
const displayedSideStories = computed(() => {
  const total = stories.value.length
  
  if (total <= 1) return stories.value.map((story, idx) => ({ ...story, originalIndex: idx }))
  
  // Hiển thị 1 story tiếp theo sau current story
  const nextIndex = (currentIndex.value + 1) % total
  
  return [
    { ...stories.value[nextIndex], originalIndex: nextIndex }
  ]
})

const getSlideCSSClass = (slideIndex: number) => {
  return `side-slide-${slideIndex}`
}

// Particle effects
const getParticleStyle = (index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomSize = Math.random() * 4 + 2
  const randomDuration = Math.random() * 20 + 10
  const randomDelay = Math.random() * 5
  
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    width: `${randomSize}px`,
    height: `${randomSize}px`,
    animationDuration: `${randomDuration}s`,
    animationDelay: `${randomDelay}s`
  }
}
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  padding: 80px 0 40px;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(196, 172, 125, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(196, 172, 125, 0.08) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0f0f0f 100%);
  color: #ffffff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.story-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 40%, rgba(196, 172, 125, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 70% 80%, rgba(196, 172, 125, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.02) 0%, transparent 20%),
    radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.01) 0%, transparent 25%);
  pointer-events: none;
  z-index: 0;
  animation: floatingBackground 20s ease-in-out infinite alternate;
}

/* Particle Effects */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(196, 172, 125, 0.6);
  border-radius: 50%;
  animation: floatParticle linear infinite;
  box-shadow: 0 0 10px rgba(196, 172, 125, 0.3);
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Floating Orbs */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(196, 172, 125, 0.15), rgba(196, 172, 125, 0.02));
  backdrop-filter: blur(1px);
  animation: floatOrb ease-in-out infinite alternate;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation-duration: 8s;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-duration: 12s;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 70%;
  animation-duration: 15s;
  animation-delay: 4s;
}

@keyframes floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translate(20px, -20px) scale(1.1);
    opacity: 0.1;
  }
}

/* Reveal Animations */
@keyframes slideInLeft {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Text Glow Animation */
@keyframes textGlow {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(196, 172, 125, 0.5),
      0 0 20px rgba(196, 172, 125, 0.3),
      0 0 30px rgba(196, 172, 125, 0.1);
  }
  50% {
    text-shadow: 
      0 0 15px rgba(196, 172, 125, 0.8),
      0 0 25px rgba(196, 172, 125, 0.5),
      0 0 35px rgba(196, 172, 125, 0.3);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes floatingBackground {
  0% {
    background: 
      radial-gradient(circle at 30% 40%, rgba(196, 172, 125, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 70% 80%, rgba(196, 172, 125, 0.06) 0%, transparent 40%),
      radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.02) 0%, transparent 20%),
      radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.01) 0%, transparent 25%);
  }
  100% {
    background: 
      radial-gradient(circle at 35% 45%, rgba(196, 172, 125, 0.12) 0%, transparent 35%),
      radial-gradient(circle at 65% 75%, rgba(196, 172, 125, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 55% 15%, rgba(255, 255, 255, 0.03) 0%, transparent 25%),
      radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.02) 0%, transparent 30%);
  }
}

.story-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  gap: 60px;
  align-items: center;
  min-height: 70vh;
  position: relative;
  z-index: 1;
}

/* Loading Overlay - Compact */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(196, 172, 125, 0.2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(196, 172, 125, 0.2);
  border-top: 3px solid rgba(196, 172, 125, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 
    0 0 20px rgba(196, 172, 125, 0.4),
    inset 0 0 20px rgba(196, 172, 125, 0.1);
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-text {
  color: rgba(196, 172, 125, 1);
  font-size: 0.9rem;
  margin-top: 12px;
  letter-spacing: 0.3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Story Controls - Compact */
.story-controls {
  position: absolute;
  top: 0px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.story-controls:hover {
  opacity: 1;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(196, 172, 125, 0.3);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(196, 172, 125, 0.8);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(196, 172, 125, 0.6);
  color: rgba(196, 172, 125, 1);
}

.keyboard-hint {
  display: none; /* Hide by default to save space */
}

/* Navigation Dots - Compact */
.navigation-dots {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: -10px;
  padding: 0 0;
}

.nav-dot {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-dot:hover {
  background: rgba(196, 172, 125, 0.1);
}

.nav-dot:focus {
  outline: 1px solid rgba(196, 172, 125, 0.6);
  outline-offset: 2px;
}

.dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-dot.active .dot-indicator {
  background: rgba(196, 172, 125, 1);
  width: 10px;
  height: 10px;
  box-shadow: 
    0 0 10px rgba(196, 172, 125, 0.8),
    0 0 20px rgba(196, 172, 125, 0.4);
}

.nav-dot.active .dot-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Hide dot labels to save space */
.dot-label {
  display: none;
}

/* Progress Bar - Minimal */
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 50;
}

.progress-fill {
  height: 100%;
  background: rgba(196, 172, 125, 0.8);
  width: 0%;
  animation: progressFill 4s linear infinite;
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: 100%; }
}

/* Image Loading State */
.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.main-image.transitioning {
  opacity: 0.7;
  transform: scale(0.98);
}

/* Side Story Preview Titles */
.story-preview-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px 12px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.swiper-slide.side-image:hover .story-preview-title {
  opacity: 1;
  transform: translateY(0);
}

/* Left Section - Story Info */
.story-info {
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  animation: slideInLeft 1s ease-out;
}

.story-icon {
  width: 320px;
  height: 320px;
  margin: 0 auto 40px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.8s ease-out 0.5s both, pulse 4s ease-in-out infinite 3s;
}

.story-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(1.2) drop-shadow(0 0 20px rgba(196, 172, 125, 0.6));
  transition: all 0.3s ease;
}

.story-icon:hover img {
  filter: brightness(1.4) drop-shadow(0 0 30px rgba(196, 172, 125, 0.8));
  transform: scale(1.05);
}

.story-title {
  font-size: 3rem;
  font-weight: 800;
  color: rgba(196, 172, 125, 1);
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: left;
  animation: fadeInUp 1s ease-out 0.7s both, textGlow 3s ease-in-out infinite 2s;
  text-shadow: 
    0 0 10px rgba(196, 172, 125, 0.5),
    0 0 20px rgba(196, 172, 125, 0.3),
    0 0 30px rgba(196, 172, 125, 0.1);
  position: relative;
}

.story-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, rgba(196, 172, 125, 0.8), rgba(196, 172, 125, 0.4), transparent);
  box-shadow: 0 0 10px rgba(196, 172, 125, 0.5);
}

.story-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  max-width: 480px;
  text-align: left;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.9s both;
}

/* Right Section - Gallery */
.story-gallery {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  animation: slideInRight 1s ease-out 0.3s both;
}

.gallery-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: -10px;
  width: 50%;
}

.carousel-btn {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(196, 172, 125, 0.4);
  background: rgba(0,0,0,0.4);
  color: rgba(196, 172, 125, 1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.carousel-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(196, 172, 125, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
  z-index: -1;
}

.carousel-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-btn:hover {
  background: rgba(0,0,0,0.6);
  border-color: rgba(196, 172, 125, 1);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 8px 25px rgba(196, 172, 125, 0.4),
    0 0 20px rgba(196, 172, 125, 0.3);
}

.carousel-btn:hover::after {
  width: 100%;
  height: 100%;
}

.carousel-btn:active {
  transform: translateY(-2px) scale(0.98);
}

.carousel-btn:hover::before {
  opacity: 1;
}

.carousel-btn svg {
  width: 28px;
  height: 28px;
  transition: transform 0.3s ease;
}

.carousel-btn:hover svg {
  transform: scale(1.2);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.carousel-btn:disabled:hover {
  background: rgba(0,0,0,0.4);
  border-color: rgba(196, 172, 125, 0.4);
  transform: none;
}

.image-gallery {
  flex: 1;
  display: flex;
  gap: 16px;
  height: 786px;
  max-width: 900px;
}

.main-image {
  width: 448px;
  height: 786px;
  position: relative;
  border-radius: 0;
  overflow: hidden;
  border: 2px solid rgba(196, 172, 125, 0.3);
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  cursor: pointer;
}

.main-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(196, 172, 125, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
  z-index: 1;
}

.main-image:hover::before {
  transform: translateX(100%);
}

.main-image:hover {
  border-color: rgba(196, 172, 125, 0.8);
  box-shadow: 
    0 0 30px rgba(196, 172, 125, 0.3),
    inset 0 0 20px rgba(196, 172, 125, 0.1);
  transform: scale(1.02);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.story-swiper {
  display: flex;
  flex-direction: column;
}

.swiper-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.swiper-slide.side-image {
  width: 200px;
  height: 786px;
  position: relative;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(196, 172, 125, 0.2);
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(5px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.side-slide-0 {
  animation-delay: 0.1s;
}

.side-slide-1 {
  animation-delay: 0.2s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.swiper-slide.side-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.swiper-slide.side-image .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(1px);
}

.swiper-slide.side-image:hover {
  border-color: rgba(196, 172, 125, 0.8);
  transform: translateX(-12px) translateY(-4px) scale(1.02);
  box-shadow: 
    8px 8px 25px rgba(196, 172, 125, 0.3),
    0 0 20px rgba(196, 172, 125, 0.2);
}

.swiper-slide.side-image:hover .overlay {
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(0px);
}

.swiper-slide.side-image:hover img {
  transform: scale(1.05);
}

/* Animation for switching images */
@keyframes imageTransition {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.main-image img {
  animation: imageTransition 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 1400px) {
  .image-gallery {
    height: 600px;
  }
  
  .main-image {
    width: 350px;
    height: 600px;
  }
  
  .swiper-slide.side-image {
    width: 180px;
    height: 600px;
  }
}

@media (max-width: 1200px) {
  .story-container {
    flex-direction: column;
    gap: 40px;
    padding: 0 20px;
  }
  
  .story-info {
    max-width: none;
    align-items: center;
    text-align: center;
  }
  
  .story-title {
    text-align: center;
  }
  
  .story-title::after {
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(196, 172, 125, 0.8), transparent);
  }
  
  .story-description {
    text-align: center;
    margin: 0 auto;
  }
  
  .story-icon {
    width: 140px;
    height: 140px;
    margin-bottom: 30px;
  }
  
  .story-title {
    font-size: 2.5rem;
  }
  
  .story-gallery {
    width: 100%;
  }
  
  .gallery-content {
    justify-content: center;
  }
  
  .image-gallery {
    height: 500px;
  }
  
  .main-image {
    width: 300px;
    height: 500px;
  }
  
  .swiper-slide.side-image {
    width: 150px;
    height: 500px;
  }
}

@media (max-width: 768px) {
  .story-view {
    padding: 60px 0 20px;
  }
  
  .story-controls {
    top: 20px;
    left: 15px;
    gap: 6px;
  }
  
  .control-btn {
    width: 28px;
    height: 28px;
  }
  
  .story-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 25px;
  }
  
  .story-title {
    font-size: 2rem;
  }
  
  .story-description {
    font-size: 1rem;
    padding: 0 10px;
  }
  
  .gallery-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .image-gallery {
    flex-direction: column;
    height: auto;
    gap: 20px;
  }
  
  .main-image {
    width: 100%;
    height: 400px;
  }
  
  .story-swiper {
    flex-direction: row;
  }
  
  .swiper-wrapper {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(196, 172, 125, 0.3) transparent;
  }
  
  .swiper-wrapper::-webkit-scrollbar {
    height: 4px;
  }
  
  .swiper-wrapper::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  .swiper-wrapper::-webkit-scrollbar-thumb {
    background: rgba(196, 172, 125, 0.5);
    border-radius: 2px;
  }
  
  .swiper-slide.side-image {
    width: 180px;
    height: 100px;
    flex-shrink: 0;
  }
  
  .carousel-btn {
    width: 50px;
    height: 50px;
    align-self: center;
  }
  
  .carousel-btn svg {
    width: 24px;
    height: 24px;
  }
  
  .navigation-dots {
    gap: 6px;
    margin-top: 10px;
    padding: 6px 0;
  }
  
  .nav-dot {
    padding: 3px;
  }
  
  .dot-indicator {
    width: 6px;
    height: 6px;
  }
  
  .nav-dot.active .dot-indicator {
    width: 8px;
    height: 8px;
  }
  
  /* Touch-friendly improvements */
  .swiper-slide.side-image {
    touch-action: manipulation;
  }
  
  .nav-dot {
    touch-action: manipulation;
    min-height: 44px; /* iOS touch target minimum */
  }
  
  .carousel-btn {
    touch-action: manipulation;
    min-width: 44px;
    min-height: 44px;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .story-container {
    padding: 0 15px;
  }
  
  .story-title {
    font-size: 1.75rem;
  }
  
  .story-description {
    font-size: 0.95rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .swiper-slide.side-image {
    width: 150px;
    height: 80px;
  }
  
  .navigation-dots {
    padding: 6px;
    gap: 4px;
  }
  
  .story-controls {
    top: 15px;
    left: 10px;
  }
  
  .control-btn {
    width: 24px;
    height: 24px;
  }
}
</style>
