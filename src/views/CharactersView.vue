<template>
  <div class="resonators-page">
    <!-- Navigation Sidebar -->
    <aside class="navigation-sidebar" role="navigation" aria-label="Faction Navigation">
      <!-- Back Navigation -->
      <nav class="back-navigation">
        <button class="back-button" type="button" aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          <span>BACK</span>
        </button>
      </nav>
      
      <!-- Faction Selection -->
      <nav class="faction-navigation" aria-label="Select Faction">
        <ul class="faction-list" role="tablist">
          <li 
            v-for="(faction, index) in factions" 
            :key="`faction-${index}`"
            class="faction-item"
            role="presentation"
          >
            <button
              class="faction-button"
              :class="{ 'faction-button--active': activeFactionIndex === index }"
              :aria-selected="activeFactionIndex === index"
              :aria-controls="`faction-panel-${index}`"
              role="tab"
              type="button"
              @click="setActiveFaction(index)"
            >
              <img 
                :src="asset(faction.icon)" 
                :alt="faction.name"
                class="faction-icon"
                loading="lazy"
              />
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Container -->
    <main class="main-container" role="main">
      <!-- Character Information Panel -->
      <section 
        class="character-info-panel"
        :id="`faction-panel-${activeFactionIndex}`"
        role="tabpanel"
        :aria-labelledby="`faction-tab-${activeFactionIndex}`"
      >
        <div class="character-info-content" :class="{ 'character-info-content--transitioning': isTransitioning }">
          <!-- Faction Description -->
          <div class="faction-description">
            <p class="faction-description__text">{{ activeFaction.description }}</p>
          </div>
          
          <!-- Character Title Section -->
          <header class="character-header">
            <img 
              class="character-symbol" 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA35pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi4vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OURBMDZERTlEQ0VGMTFFRUIxNDZEOTE1REE4RUZGMjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA1NEQ1MjlFMTEwMTFFRUFDQTdDREQ0QjAzRjEwQ0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA1NEQ1MjhFMTEwMTFFRUFDQTdDREQ0QjAzRjEwQ0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODQ1ZWVlYTEtZGQzNy1mNzQxLTkzN2QtN2U1MzEwZTU0ZjY1IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2E0M2E4YWMtZjg3Yy0xNjQwLThhYmUtZGEyM2Mz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" 
              alt="Character Symbol" 
              aria-hidden="true" 
            />
            <h1 class="character-name">{{ activeCharacter.name }}</h1>
            <p class="character-title" v-if="activeCharacter.title">{{ activeCharacter.title }}</p>
          </header>
          
          <!-- Character Biography -->
          <div class="character-biography">
            <p class="character-biography__text">{{ activeCharacter.description }}</p>
          </div>
        </div>
      </section>
      
      <!-- Character Visual Section -->
      <section class="character-visual-section" aria-label="Character Gallery">
        <!-- Main Character Display -->
        <div class="character-main-display">
        </div>
        
        <!-- Character Swiper Carousel -->
        <div 
          class="character-swiper" 
          :class="{ 
            'swiper--sliding-left': slideDirection === 'from-left',
            'swiper--sliding-right': slideDirection === 'from-right'
          }"
          role="region" 
          aria-label="Character Selection"
        >
          <div class="swiper-wrapper">
            <div
              v-for="(character, slideIndex) in displayedSlides"
              :key="`slide-${character.name}-${slideIndex}`"
              class="swiper-slide"
              :class="getSlideCSSClass(slideIndex)"
              @click="handleSlideClick(slideIndex)"
            >
              <figure class="character-slide-figure">
                <img 
                  :src="asset(character.image)" 
                  :alt="character.name"
                  class="character-slide-image"
                  loading="lazy"
                />
                <figcaption class="character-slide-caption">
                  {{ character.name }}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { asset } from '@/utils/asset'

// Character symbol constants
const CHARACTER_SYMBOLS = {
  default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA35pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OURBMDZERTlEQ0VGMTFFRUIxNDZEOTE1REE4RUZGMjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA1NEQ1MjlFMTEwMTFFRUFDQTdDREQ0QjAzRjEwQ0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA1NEQ1MjhFMTEwMTFFRUFDQTdDREQ0QjAzRjEwQ0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODQ1ZWVlYTEtZGQzNy1mNzQxLTkzN2QtN2U1MzEwZTU0ZjY1IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2E0M2E4YWMtZjg3Yy0xNjQwLThhYmUtZGEyM2Mz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",
  // Bạn có thể thêm các symbol khác ở đây
  spectro: "data:image/png;base64,...", // Symbol cho element Spectro
  fusion: "data:image/png;base64,...",  // Symbol cho element Fusion
  // v.v...
} as const

interface Character {
  name: string
  title: string
  image: string
  element: string
  rarity: number
  weapon: string
  description: string
}

interface Faction {
  name: string
  icon: string
  symbol: string
  description: string
  characters: Character[]
}

// Reactive state
const activeFactionIndex = ref(0)
const activeCharacterIndex = ref(0)
const currentPage = ref(0)
// Sample factions data
const factions = ref<Faction[]>([
  {
    name: 'UNKNOWN',
  icon: asset('/images/icon-01.png'),
  symbol: asset('/images/symbol-huanglong.png'),
    description: 'Intercontinental Traveler',
    characters: [
      {
        name: 'Rover',
        title: 'Is this the beginning of a new journey? Brimming with novel sounds, and untold stories...',
  image: asset('/images/demo1.png'),
        element: 'Dark',
        rarity: 5,
        weapon: 'Bow',
        description: 'Awakened with an unknown past, Rover embarks on a journey to uncover the truths.As secrets are unveiled, Rover establishes deeper connections with the world.'
      },
      {
        name: 'Rover',
        title: 'Is this the beginning of a new journey? Brimming with novel sounds, and untold stories...',
  image: asset('/images/demo2.png'),
        element: 'Dark',
        rarity: 5,
        weapon: 'Sword',
        description: 'Awakened with an unknown past, Rover embarks on a journey to uncover the truths.As secrets are unveiled, Rover establishes deeper connections with the world.'
      },
    ]
  },
  {
    name: 'HUANG LONG',
      icon: asset('/images/icon-02.png'),
    symbol: asset('/images/symbol-federation.png'),
    description: "HUANG LONG",
    characters: [
      {
        name: 'Yinlin',
        title: 'Name\'s Yinlin. As for what I do... Shhh, we don\'t talk about that in public.',
  image: asset('/images/yinlin-9f681990.png'),
        element: 'Spectro',
        rarity: 5,
        weapon: 'Sword',
description: 'Previously known as an outstanding Jinzhou Patroller, Yinlin is steady and reliable, yet harbors hidden depths of secrets. She excels at exploiting resources at her disposal to uncover lurking crimes. Beneath her aloof and flamboyant exterior, Yinlin possesses a heart of gold, reserved only for those she deems trustworthy.'
      },
      {
        name: 'Zhezhi',
        title: 'What I wanted to say is, the sunlight on you right now is so beautiful. Can I... paint you?',
  image: asset('/images/zhezhi-6698177e.png'),
        element: 'Fusion',
        rarity: 5,
        weapon: 'Rectifier',
        description: "Zhezhi is a commissioned painter, quiet and shy with a dedication to her craft. She's not very eloquent, but her persistence and love for painting speak volumes."
      },
      {
        name: 'Changli',
        title: 'Eons of time on this vast land, all encapsulated in a humble game...I am fortunate to have you as my opponent.',
  image: asset('/images/changli-3da788f2.png'),
        element: 'Fusion',
        rarity: 5,
        weapon: 'Rectifier',
    description: "Counselor to the Jinzhou Magistrate, Changli excels at leveraging human nature to corner her enemies into traps. Being the mentor to Jinhsi, she is persuasive and patient. She entertains an unwavering aspiration, holding her ground in the endless game against time and chaos."
  }
]
  },
  {
    name: 'BLACK SHORES',
  icon: asset('/images/icon-03.png'),
  symbol: asset('/images/symbol-blackshores.png'),
    description: 'BLACK SHORES',
    characters: [
      {
        name: 'The Shorekeeper',
        title: '"The Shorekeeper"... This name suits me well enough. It aligns with my purpose and drive: they only exist because of you.',
  image: asset('/images/cantarella-f997fb74.png'),
        element: 'Spectro',
        rarity: 5,
        weapon: 'Rectifier',
        description: 'The Shorekeeper of the Black Shores, a mysterious divine being governing the essence of aloofness, emerges in response to your summon. Having spent eons in guardianship, the first stirrings of emotion and desire awaken within her heart, fostering a firm determination to connect with the world — and with you.'
      },
      {
        name: 'The Shorekeeper',
        title: '"The Shorekeeper"... This name suits me well enough. It aligns with my purpose and drive: they only exist because of you.',
        image: asset('/images/cantarella-f997fb74.png'),
        element: 'Spectro',
        rarity: 5,
        weapon: 'Rectifier',
        description: 'The Shorekeeper of the Black Shores, a mysterious divine being governing the essence of aloofness, emerges in response to your summon. Having spent eons in guardianship, the first stirrings of emotion and desire awaken within her heart, fostering a firm determination to connect with the world — and with you.'
      },
      {
        name: 'The Shorekeeper',
        title: '"The Shorekeeper"... This name suits me well enough. It aligns with my purpose and drive: they only exist because of you.',
        image: asset('/images/cantarella-f997fb74.png'),
        element: 'Spectro',
        rarity: 5,
        weapon: 'Rectifier',
        description: 'The Shorekeeper of the Black Shores, a mysterious divine being governing the essence of aloofness, emerges in response to your summon. Having spent eons in guardianship, the first stirrings of emotion and desire awaken within her heart, fostering a firm determination to connect with the world — and with you.'
      }
    ]
  },
  {
    name: 'Midnight Rangers',
  icon: asset('/images/icon-04.png'),
  symbol: asset('/images/symbol-rangers.png'),
    description: 'Elite scouts and protectors of the wilderness',
    characters: [
      {
        name: 'Aalto',
        title: 'The Mist Walker',
  image: asset('/images/character4-1.jpg'),
        element: 'Aero',
        rarity: 4,
        weapon: 'Pistols',
        description: 'A mysterious ranger who moves like mist'
      }
    ]
  },
  {
    name: 'Ghost Hounds',
  icon: asset('/images/icon-05.png'),
  symbol: asset('/images/symbol-ghosts.png'),
    description: 'Mercenaries and outcasts seeking redemption',
    characters: [
      {
        name: 'Danjin',
        title: 'The Blood Blade',
  image: asset('/images/character5-1.jpg'),
        element: 'Havoc',
        rarity: 4,
        weapon: 'Sword',
        description: 'A warrior who fights with her own blood'
      }
    ]
  },
  {
    name: 'Sentinel Corps',
  icon: asset('/images/icon-06.png'),
  symbol: asset('/images/symbol-sentinel.png'),
    description: 'Elite guardians of ancient secrets',
    characters: [
      {
        name: 'Jiyan',
        title: 'The Dragon General',
  image: asset('/images/character6-1.jpg'),
        element: 'Aero',
        rarity: 5,
        weapon: 'Broadblade',
        description: 'The legendary general who commands the winds'
      }
    ]
  },
  {
    name: 'Crystal Order',
  icon: asset('/images/icon-07.png'),
  symbol: asset('/images/symbol-crystal.png'),
    description: 'Masters of crystalline energy and ancient knowledge',
    characters: [
      {
        name: 'Verina',
        title: 'The Crystal Sage',
  image: asset('/images/character7-1.jpg'),
        element: 'Spectro',
        rarity: 5,
        weapon: 'Rectifier',
        description: 'A scholar who harnesses the power of crystals'
      }
    ]
  }
])

// Computed properties
const activeFaction = computed(() => factions.value[activeFactionIndex.value])
const activeCharacter = computed(() => activeFaction.value.characters[activeCharacterIndex.value])

// Swiper logic - hiển thị 3 slides với current ở giữa
const displayedSlides = computed(() => {
  const characters = activeFaction.value.characters
  const total = characters.length
  
  if (total === 0) return []
  if (total === 1) return [characters[0]]
  if (total === 2) return [characters[0], characters[1]]
  
  // Với 3+ characters, luôn hiển thị 3 slides với current character ở giữa
  const current = activeCharacterIndex.value
  const prev = (current - 1 + total) % total
  const next = (current + 1) % total
  
  return [
    characters[prev],  // slide 0 (left)
    characters[current], // slide 1 (center/active)  
    characters[next]   // slide 2 (right)
  ]
})

const getSlideCSSClass = (slideIndex: number) => {
  const characters = activeFaction.value.characters
  if (characters.length <= 2) {
    return {
      'swiper-slide--active': slideIndex === activeCharacterIndex.value,
      'swiper-slide--center': slideIndex === activeCharacterIndex.value
    }
  }
  
  // Với 3+ characters, slide 1 (index 1) luôn là center/active
  return {
    'swiper-slide--left': slideIndex === 0,
    'swiper-slide--center': slideIndex === 1,
    'swiper-slide--right': slideIndex === 2,
    'swiper-slide--active': slideIndex === 1
  }
}

// Animation state
const isTransitioning = ref(false)
const slideDirection = ref('')

// Methods with enhanced animations
const setActiveFaction = (index: number) => {
  if (activeFactionIndex.value === index) return
  
  isTransitioning.value = true
  
  // Smooth fade out with scale effect
  setTimeout(() => {
    activeFactionIndex.value = index
    activeCharacterIndex.value = 0
    currentPage.value = 0
    
    // Smooth fade in with slide effect
    setTimeout(() => {
      isTransitioning.value = false
    }, 400)
  }, 350)
}

const setActiveCharacter = (index: number) => {
  if (activeCharacterIndex.value === index) return
  
  isTransitioning.value = true
  
  setTimeout(() => {
    activeCharacterIndex.value = index
    setTimeout(() => {
      isTransitioning.value = false
    }, 150)
  }, 300)
}

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

// Swiper interaction methods với optimized performance
const handleSlideClick = (slideIndex: number) => {
  const characters = activeFaction.value.characters
  const total = characters.length
  
  if (total <= 2) {
    // Với 1-2 characters, click trực tiếp
    setActiveCharacter(slideIndex)
    return
  }
  
  // Với 3+ characters - optimized for performance
  if (slideIndex === 1) {
    // Click vào center slide - không làm gì (đã active)
    return
  } else if (slideIndex === 0) {
    // Click vào left slide - instant update
    const newIndex = (activeCharacterIndex.value - 1 + total) % total
    activeCharacterIndex.value = newIndex
  } else if (slideIndex === 2) {
    // Click vào right slide - instant update
    const newIndex = (activeCharacterIndex.value + 1) % total
    activeCharacterIndex.value = newIndex
  }
}

const setActiveCharacterWithDrag = (index: number) => {
  if (activeCharacterIndex.value === index) return
  
  // Ultra-fast update for smooth performance
  activeCharacterIndex.value = index
  
  // Minimal delay for direction reset
  setTimeout(() => {
    slideDirection.value = ''
  }, 100)
}
</script>

<style scoped>
/* Wuthering Waves Resonators Page - Enhanced Background */
.resonators-page {
  display: flex;
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(196, 172, 125, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(196, 172, 125, 0.08) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0f0f0f 100%);
  color: #ffffff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

/* Enhanced Background decorative elements */
.resonators-page::before {
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

/* Additional atmospheric overlay */
.resonators-page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 0%, rgba(196, 172, 125, 0.02) 50%, transparent 100%),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(196, 172, 125, 0.01) 2px,
      rgba(196, 172, 125, 0.01) 4px
    );
  pointer-events: none;
  z-index: 1;
  animation: subtleShimmer 8s ease-in-out infinite alternate;
}

@keyframes subtleShimmer {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

@keyframes centerGlow {
  0% { 
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 50px rgba(196, 172, 125, 0.4),
      0 0 80px rgba(196, 172, 125, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  100% { 
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 0 70px rgba(196, 172, 125, 0.6),
      0 0 120px rgba(196, 172, 125, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes slideLeft {
  0% { 
    transform: translateX(-50px) scale(0.9);
    opacity: 0.6;
    filter: blur(3px);
  }
  50% {
    transform: translateX(-10px) scale(0.95);
    opacity: 0.8;
    filter: blur(1px);
  }
  100% { 
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: blur(0px);
  }
}

@keyframes slideRight {
  0% { 
    transform: translateX(50px) scale(0.9);
    opacity: 0.6;
    filter: blur(3px);
  }
  50% {
    transform: translateX(10px) scale(0.95);
    opacity: 0.8;
    filter: blur(1px);
  }
  100% { 
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: blur(0px);
  }
}

@keyframes focusIn {
  0% { 
    opacity: 0.6;
    transform: scale(0.95);
    filter: blur(2px);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
    filter: blur(1px);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes glowPulse {
  0% {
    box-shadow: 
      0 0 20px rgba(196, 172, 125, 0.3),
      0 0 40px rgba(196, 172, 125, 0.2),
      0 0 60px rgba(196, 172, 125, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(196, 172, 125, 0.5),
      0 0 60px rgba(196, 172, 125, 0.3),
      0 0 90px rgba(196, 172, 125, 0.2);
  }
  100% {
    box-shadow: 
      0 0 20px rgba(196, 172, 125, 0.3),
      0 0 40px rgba(196, 172, 125, 0.2),
      0 0 60px rgba(196, 172, 125, 0.1);
  }
}



/* Navigation Sidebar */
.navigation-sidebar {
  width: 220px;
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
    radial-gradient(circle at 50% 0%, rgba(196, 172, 125, 0.1) 0%, transparent 70%);
  backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(196, 172, 125, 0.2);
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  position: relative;
  z-index: 10;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 50px rgba(196, 172, 125, 0.05);
}

.navigation-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* Back Navigation */
.back-navigation {
  margin-bottom: 40px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.back-button:hover,
.back-button:focus-visible {
  color: rgba(255, 255, 255, 0.9);
  outline: 2px solid rgba(196, 172, 125, 0.5);
  outline-offset: 2px;
}

.back-button svg {
  width: 16px;
  height: 16px;
}

/* Faction Navigation */
.faction-navigation {
  flex: 1;
}

.faction-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.faction-item {
  display: flex;
  justify-content: center;
}

/* Faction Button */
.faction-button {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  position: relative;
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(10px);
  font-family: inherit;
  animation: fadeInUp 0.8s ease-out both;
  will-change: transform;
  transform: translateZ(0);
}

.faction-item:nth-child(1) .faction-button { animation-delay: 0.1s; }
.faction-item:nth-child(2) .faction-button { animation-delay: 0.2s; }
.faction-item:nth-child(3) .faction-button { animation-delay: 0.3s; }
.faction-item:nth-child(4) .faction-button { animation-delay: 0.4s; }
.faction-item:nth-child(5) .faction-button { animation-delay: 0.5s; }
.faction-item:nth-child(6) .faction-button { animation-delay: 0.6s; }
.faction-item:nth-child(7) .faction-button { animation-delay: 0.7s; }

.faction-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.3), rgba(196, 172, 125, 0.1));
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.faction-button:hover,
.faction-button:focus-visible {
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-color: rgba(196, 172, 125, 0.6);
  transform: scale(1.08) translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(196, 172, 125, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  outline: none;
}

.faction-button:hover::before,
.faction-button:focus-visible::before {
  opacity: 1;
}

.faction-button--active {
  background: 
    linear-gradient(135deg, rgba(196, 172, 125, 0.25) 0%, rgba(196, 172, 125, 0.1) 100%);
  border-color: var(--gold);
  box-shadow: 
    0 0 30px rgba(196, 172, 125, 0.4),
    0 0 60px rgba(196, 172, 125, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.faction-button--active::before {
  opacity: 1;
}

.faction-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 6px;
  transition: all 0.3s ease;
  filter: contrast(2) brightness(1.1) saturate(1.1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.faction-button:hover .faction-icon,
.faction-button:focus-visible .faction-icon,
.faction-button--active .faction-icon {
  transform: scale(1.1);
  filter: contrast(2) brightness(2) saturate(2);
}

/* Main Container */
.main-container {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* Character Info Panel */
.character-info-panel {
  flex: 1;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 5;
}

.character-info-content {
  max-width: 600px;
  transition: all 0.2s ease-out;
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
  filter: blur(0px);
  will-change: transform, opacity;
}

.character-info-content--transitioning {
  transform: translate3d(-30px, 0, 0) scale(0.95);
  opacity: 0.3;
  filter: blur(2px);
}

/* Faction Description */
.faction-description {
  margin-bottom: 50px;
}

.faction-description__text {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(196, 172, 125, 0.6),
    0 0 40px rgba(196, 172, 125, 0.3);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  position: relative;
}

.faction-description__text::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(196, 172, 125, 0.8), rgba(196, 172, 125, 0.3));
  animation: expandLine 1s ease-out 0.6s both;
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 100%; }
}

/* Character Header */
.character-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.character-symbol {
  width: 40px;
  height: 40px;
  filter: 
    drop-shadow(0 0 15px rgba(196, 172, 125, 0.8))
    drop-shadow(0 0 30px rgba(196, 172, 125, 0.4));
  animation: pulseGlow 2s ease-in-out infinite alternate;
  flex-shrink: 0;
}

@keyframes pulseGlow {
  0% { 
    text-shadow: 
      0 0 15px rgba(196, 172, 125, 0.8),
      0 0 30px rgba(196, 172, 125, 0.4);
  }
  100% { 
    text-shadow: 
      0 0 20px rgba(196, 172, 125, 1),
      0 0 40px rgba(196, 172, 125, 0.6),
      0 0 60px rgba(196, 172, 125, 0.3);
  }
}

.character-name {
  font-size: 4.2rem;
  font-weight: 200;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.05em;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(196, 172, 125, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  transition: all 0.3s ease;
}

.character-name:hover {
  transform: translateY(-2px);
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(196, 172, 125, 0.4);
}

.character-title {
  font-size: 1.2rem;
  color: rgba(196, 172, 125, 0.9);
  margin: 0;
  font-weight: 400;
  font-style: italic;
  width: 100%;
  margin-top: -10px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.character-title:hover {
  opacity: 1;
}

/* Character Biography */
.character-biography {
  max-width: 520px;
}

.character-biography__text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.8;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s ease-out 0.8s both;
  transition: color 0.3s ease;
}

.character-biography__text:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* Character Visual Section */
.character-visual-section {
  position: relative;
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Character Swiper với drag effects */
.character-swiper {
  position: absolute;
  right: 1%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 866px;
  height: 731px;
  overflow: hidden;
}

.swiper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  gap: 20px;
  transition: all 0.2s ease-out;
  animation: fadeInUp 1s ease-out 0.5s both;
}

/* Optimized Transition Effects */
.swiper--sliding-left .swiper-wrapper {
  animation: slideLeft 0.3s ease-out;
}

.swiper--sliding-right .swiper-wrapper {
  animation: slideRight 0.3s ease-out;
}

/* Swiper Slide - optimized performance */
.swiper-slide {
  border-radius: 0;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 
    transform 0.15s ease-out,
    opacity 0.15s ease-out;
  position: relative;
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(5px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
  transform: translateZ(0); /* Hardware acceleration */
}

.swiper-slide:active {
  transform: scale(0.98);
}

.swiper-slide::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.6), rgba(196, 172, 125, 0.3));
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

/* Left Slide - performance optimized */
.swiper-slide--left {
  width: 250px;
  height: 731px;
  opacity: 0.8;
  transform: translate3d(20px, 0, 0);
  z-index: 1;
  border-radius: 0;
  transition: all 0.2s ease-out;
  will-change: transform, opacity;
}

.swiper-slide--left:hover {
  opacity: 0.9;
  transform: translate3d(15px, 0, 0) scale(1.02);
}

.swiper--sliding-left .swiper-slide--left {
  animation: focusIn 0.2s ease-out;
}

/* Center Slide - performance optimized */
.swiper-slide--center {
  width: 366px;
  height: 731px;
  opacity: 1;
  transform: translate3d(0, 0, 0);
  z-index: 3;
  border-color: var(--gold);
  border-radius: 0;
  will-change: transform;
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(196, 172, 125, 0.3);
  animation: glowPulse 4s ease-in-out infinite;
}

.swiper-slide--center::before {
  opacity: 1;
}

/* Right Slide - performance optimized */
.swiper-slide--right {
  width: 250px;
  height: 731px;
  opacity: 0.8;
  transform: translate3d(-20px, 0, 0);
  z-index: 1;
  border-radius: 0;
  transition: all 0.2s ease-out;
  will-change: transform, opacity;
}

.swiper-slide--right:hover {
  opacity: 0.9;
  transform: translate3d(-15px, 0, 0) scale(1.02);
}

.swiper--sliding-right .swiper-slide--right {
  animation: focusIn 0.4s ease-out;
}

/* Bỏ hover effect cho right slide */

/* Active state cho tất cả slides */
.swiper-slide--active {
  border-color: var(--gold);
}

/* Character Slide Figure */
.character-slide-figure {
  width: 100%;
  height: 100%;
  margin: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease-out;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Simple image effects */
.swiper-slide--left .character-slide-image,
.swiper-slide--right .character-slide-image {
  filter: brightness(0.9);
  object-fit: cover;
  object-position: center;
}

.swiper-slide--center .character-slide-image {
  filter: none;
  object-fit: cover;
  object-position: center;
}

.swiper-slide--center:hover .character-slide-image {
  transform: scale(1.02);
}

.swiper-slide--left:hover .character-slide-image,
.swiper-slide--right:hover .character-slide-image {
  filter: none;
}

/* Bỏ hover effect cho left và right slide images */

.character-slide-caption {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
  backdrop-filter: blur(12px);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid rgba(196, 172, 125, 0.5);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  margin: 0;
  opacity: 1;
  transition: all 0.4s ease;
}

/* Caption effects cho từng slide */
.swiper-slide--left .character-slide-caption,
.swiper-slide--right .character-slide-caption {
  font-size: 0.7rem;
  padding: 6px 8px;
  opacity: 0.8;
}

.swiper-slide--center .character-slide-caption {
  font-size: 0.9rem;
  padding: 10px 14px;
  border-color: var(--gold);
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.9),
    0 0 10px rgba(196, 172, 125, 0.5);
}

/* Background decorative elements */
.character-images::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 70% 30%, rgba(196, 172, 125, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 70%, rgba(196, 172, 125, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.03) 0%, transparent 30%),
    linear-gradient(45deg, transparent 40%, rgba(196, 172, 125, 0.02) 50%, transparent 60%);
  pointer-events: none;
  z-index: 1;
  animation: backgroundFloat 12s ease-in-out infinite alternate;
}

@keyframes backgroundFloat {
  0% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  100% { 
    transform: translateY(-10px) rotate(1deg);
    opacity: 0.9;
  }
}

/* Floating particles effect */
.character-images::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(196, 172, 125, 0.4), transparent),
    radial-gradient(2px 2px at 40% 70%, rgba(196, 172, 125, 0.3), transparent),
    radial-gradient(1px 1px at 60% 20%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 80% 80%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 90% 40%, rgba(196, 172, 125, 0.2), transparent);
  background-size: 200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px;
  animation: particleFloat 20s linear infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes particleFloat {
  0% { 
    background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
  100% { 
    background-position: 100% 100%, -100% 100%, 100% -100%, -100% -100%, 100% 50%;
  }
}

/* Responsive Design */
@media (max-width: 1400px) {
  .character-swiper {
    right: -8%;
    width: 500px;
    height: 350px;
  }
  
  .swiper-slide--center {
    width: 310px;
    height: 620px;
  }
  
  .swiper-slide--left,
  .swiper-slide--right {
    width: 212px;
    height: 620px;
  }
}

@media (max-width: 1200px) {
  .faction-sidebar {
    width: 180px;
    padding: 25px 15px;
  }
  
  .character-display {
    padding: 40px 50px;
  }
  
  .character-name {
    font-size: 4rem;
  }
  
  .character-thumbnails {
    right: -3%;
  }
  
  .character-thumbnail {
    width: 130px;
    height: 230px;
  }
}

@media (max-width: 768px) {
  .resonators-page {
    flex-direction: column;
  }
  
  .navigation-sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    padding: 20px;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: 
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-right: none;
    border-bottom: 1px solid rgba(196, 172, 125, 0.2);
  }
  
  .back-navigation {
    margin-bottom: 0;
    margin-right: 20px;
  }
  
  .faction-list {
    flex-direction: row;
    gap: 15px;
    flex: none;
  }
  
  .faction-button {
    width: 60px;
    height: 60px;
  }
  
  .faction-icon {
    width: 45px;
    height: 45px;
  }
  
  .main-container {
    flex-direction: column;
    min-height: calc(100vh - 120px);
  }
  
  .character-info-panel {
    padding: 40px 25px;
    text-align: center;
    order: 2;
  }
  
  .character-name {
    font-size: 3rem;
  }
  
  .character-header {
    justify-content: center;
  }
  
  .character-visual-section {
    width: 100%;
    height: 50vh;
    position: relative;
    order: 1;
  }
  
  .character-swiper {
    position: absolute;
    bottom: 20px;
    right: 20px;
    left: 20px;
    transform: none;
    width: auto;
    height: 150px;
  }
  
  .swiper-wrapper {
    gap: 10px;
  }
  
  .swiper-slide--center {
    width: 120px;
    height: 140px;
  }
  
  .swiper-slide--center {
    width: 220px;
    height: 440px;
  }
  
  .swiper-slide--left,
  .swiper-slide--right {
    width: 150px;
    height: 440px;
  }
}

@media (max-width: 480px) {
  .navigation-sidebar {
    padding: 15px;
    gap: 10px;
  }
  
  .faction-button {
    width: 50px;
    height: 50px;
  }
  
  .faction-icon {
    width: 35px;
    height: 35px;
  }
  
  .character-info-panel {
    padding: 30px 20px;
  }
  
  .character-name {
    font-size: 2.2rem;
  }
  
  .character-symbol {
    font-size: 1.8rem;
  }
  
  .faction-description__text {
    font-size: 0.9rem;
  }
  
  .character-biography__text {
    font-size: 0.85rem;
  }
  
  .character-swiper {
    bottom: 15px;
    right: 15px;
    left: 15px;
    height: 120px;
  }
  
  .swiper-wrapper {
    gap: 8px;
  }
  
  .swiper-slide--center {
    width: 155px;
    height: 310px;
  }
  
  .swiper-slide--left,
  .swiper-slide--right {
    width: 106px;
    height: 310px;
  }
  
  .character-slide-caption {
    font-size: 0.65rem;
    padding: 4px 6px;
  }
}


</style>