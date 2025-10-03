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
          <RouterLink to="/"           :class="{active: isActive('/home')}">HOME</RouterLink>
          <RouterLink to="/news"       :class="{active: isActive('/news')}">NEWS</RouterLink>
          <RouterLink to="/characters" :class="{active: isActive('/characters')}">CHARACTERS</RouterLink>
          <RouterLink to="/world"      :class="{active: isActive('/world')}">WORLD</RouterLink>
          <RouterLink to="/story"      :class="{active: isActive('/story')}">STORY</RouterLink>
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
          <img src="/images/btn-login.png" alt="User Avatar" />
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

<style scoped>
.site-header{position:fixed;inset:0 0 auto;z-index:50;background:rgba(0,0,0,.4);backdrop-filter:blur(12px);border-bottom:none}
.row{display:flex;align-items:center;justify-content:space-between;padding:8px 24px;gap:20px}

/* Logo Box */
.logo-box{
  display:flex;
  align-items:center;
  flex:1;
  justify-content:flex-start;
  margin-left:-320px;
  margin-right:0px;
}
.logo{font-weight:800;letter-spacing:.20em;color:var(--gold);font-size:18px}

/* Menu Box */
.menu-box{
  display:flex;
  align-items:center;
  flex:2;
  justify-content:center;
  margin-left:0px;
  margin-right:0px;
}
.nav{display:flex;gap:32px;align-items:center}
.nav > a, .has-sub > a{font-size:15px;letter-spacing:.08em;opacity:.92;font-weight:500}
.nav a:hover, .nav .active{color:var(--gold)}

/* Controls Box */
.controls-box{
  display:flex;
  align-items:center;
  gap:10px;
  flex:1;
  justify-content:flex-end;
  margin-left:0px;
  margin-right:-320px;
}

/* Language Dropdown */
.language-dropdown{
  position:relative;
}

.language-dropdown .chip{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  cursor:pointer;
  transition:all 0.3s ease;
  min-width:100px;
  width:100px;
  text-align:center;
}

.language-dropdown .arrow{
  transition:transform 0.3s ease;
  transform-origin:center;
}

.language-dropdown.open .arrow{
  transform:rotate(180deg);
}

.dropdown-menu{
  position:absolute;
  top:100%;
  left:0;
  right:0;
  background:rgba(0,0,0,.9);
  border:1px solid color-mix(in oklab,var(--gold) 30%, transparent);
  border-radius:10px;
  backdrop-filter:blur(12px);
  margin-top:4px;
  padding:8px 0;
  z-index:100;
  animation:dropdownFade 0.3s ease;
}

@keyframes dropdownFade {
  from { opacity:0; transform:translateY(-10px); }
  to { opacity:1; transform:translateY(0); }
}

.dropdown-menu a{
  display:block;
  padding:8px 12px;
  color:var(--parchment);
  font-size:14px;
  transition:all 0.2s ease;
  cursor:pointer;
}

.dropdown-menu a:hover{
  background:rgba(255,255,255,.05);
  color:var(--gold);
  transform:translateX(4px);
}

/* BGM Button */
.bgm-button {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bgm-button .music-icon {
  display: inline-block;
  transition: all 0.3s ease;
}

.bgm-button.playing .music-icon {
  animation: musicPulse 1.5s ease-in-out infinite;
  color: var(--gold);
}

.bgm-button.paused .music-icon {
  color: var(--parchment);
  opacity: 1;
}

.bgm-button:hover {
  border-color: color-mix(in oklab, var(--gold) 60%, transparent);
  transform: scale(1.05);
}

@keyframes musicPulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 1; 
  }
  25% { 
    transform: scale(1.1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 1; 
  }
  75% { 
    transform: scale(1.15); 
    opacity: 0.9; 
  }
}

.chip{
  border:1px solid color-mix(in oklab,var(--gold) 30%, transparent);
  background:transparent;
  border-radius:10px;
  color:var(--parchment);
  padding:8px 16px;
  font-size:14px;
  font-weight:500;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.avatar{
  width:32px;
  height:32px;
  border-radius:50%;
  border:1px solid color-mix(in oklab,var(--gold) 30%, transparent);
  background:transparent;
  padding:0;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:all 0.3s ease;
}

.avatar:hover{
  transform:scale(1.1);
  border-color:color-mix(in oklab,var(--gold) 60%, transparent);
}

.avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius:50%;
}
</style>