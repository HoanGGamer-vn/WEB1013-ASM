<template>
  <header class="site-header">
    <div class="container row">
      <!-- Logo Box -->
      <div class="logo-box">
        <RouterLink to="/" class="logo">ERROR404</RouterLink>
      </div>

      <!-- Menu Box -->
      <div class="menu-box">
        <nav class="nav">
          <RouterLink to="/" :class="{active: isActive('/home')}">HOME</RouterLink>
          <RouterLink to="/news" :class="{active: isActive('/news')}">NEWS</RouterLink>
          <RouterLink to="/characters" :class="{active: isActive('/characters')}">CHARACTERS</RouterLink>
          <RouterLink to="/world" :class="{active: isActive('/world')}">WORLD</RouterLink>
          <RouterLink to="/story" :class="{active: isActive('/story')}">STORY</RouterLink>
        </nav>
      </div>

      <!-- Controls Box -->
      <div class="controls-box">
        <div class="language-dropdown" :class="{open: langOpen}">
          <button class="chip" @click="langOpen = !langOpen">
            {{ selectedLang }}
            <span class="arrow">▾</span>
          </button>
          <div class="dropdown-menu" v-show="langOpen">
            <a href="#" @click="selectLanguage('English')">🇺🇸 English</a>
            <a href="#" @click="selectLanguage('Tiếng Việt')">🇻🇳 Tiếng Việt</a>
            <a href="#" @click="selectLanguage('日本語')">🇯🇵 日本語</a>
            <a href="#" @click="selectLanguage('한국어')">🇰🇷 한국어</a>
            <a href="#" @click="selectLanguage('中文')">🇨🇳 中文</a>
          </div>
        </div>
        <button class="chip bgm-button" 
                :class="{playing: isPlaying, paused: !isPlaying}" 
                @click="toggleBGM" 
                aria-label="BGM"
                :title="isPlaying ? 'Pause BGM' : 'Play BGM'">
          <span class="music-icon">♪</span>
        </button>
        <button class="avatar" aria-label="User" @click="showLogin = true">
          <img src="/WEB1013-ASM/images/btn-login.png" alt="User Avatar" />
        </button>
      </div>
    </div>
  </header>

  <!-- Login Modal -->
  <LoginModal :showModal="showLogin" @close="showLogin = false" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import LoginModal from './LoginModal.vue'

const route = useRoute()
const langOpen = ref(false)
const selectedLang = ref('English')

// BGM functionality
const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)

// Login functionality
const showLogin = ref(false)

const isActive = (p:string) => route.path === p

const selectLanguage = (lang: string) => {
  selectedLang.value = lang
  langOpen.value = false
}

// BGM controls
const toggleBGM = () => {
  console.log('BGM button clicked!')
  
  if (!audio.value) {
    console.log('Creating new audio element...')
    audio.value = new Audio('/audio/bgm.mp3')
    audio.value.loop = true
    audio.value.volume = 0.3
    
    audio.value.addEventListener('loadstart', () => console.log('Audio loading started'))
    audio.value.addEventListener('canplay', () => console.log('Audio can play'))
    audio.value.addEventListener('error', (e) => console.error('Audio error:', e))
  }

  if (isPlaying.value) {
    console.log('Pausing audio...')
    audio.value.pause()
    isPlaying.value = false
  } else {
    console.log('Playing audio...')
    audio.value.play().then(() => {
      console.log('Audio started playing successfully!')
      isPlaying.value = true
    }).catch(error => {
      console.error('Cannot play BGM:', error)
      alert('Không thể phát nhạc. Kiểm tra console để xem lỗi chi tiết.')
    })
  }
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (target && !target.closest('.language-dropdown')) {
    langOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<style scoped src="../../../separated-files/css/components/Header.css">
/* CSS đã được tách ra file riêng */
</style>