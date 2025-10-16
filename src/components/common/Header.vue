<template>
  <header class="site-header" role="banner">
    <div class="container row">
      <!-- Logo Box -->
      <div class="logo-box">
        <RouterLink to="/" class="logo" aria-label="Error404 - Go to homepage">ERROR404</RouterLink>
      </div>

      <!-- Menu Box -->
      <div class="menu-box">
        <nav id="navigation" class="nav" role="navigation" :aria-label="$t('nav.mainNavigation')">
          <RouterLink to="/" 
                      :class="{active: isActive('/home')}"
                      :aria-current="isActive('/home') ? 'page' : undefined">
            {{ $t('nav.home') }}
          </RouterLink>
          <RouterLink to="/news" 
                      :class="{active: isActive('/news')}"
                      :aria-current="isActive('/news') ? 'page' : undefined">
            {{ $t('nav.news') }}
          </RouterLink>
          <RouterLink to="/characters" 
                      :class="{active: isActive('/characters')}"
                      :aria-current="isActive('/characters') ? 'page' : undefined">
            {{ $t('nav.characters') }}
          </RouterLink>
          <RouterLink to="/story" 
                      :class="{active: isActive('/story')}"
                      :aria-current="isActive('/story') ? 'page' : undefined">
            {{ $t('nav.story') }}
          </RouterLink>
          <RouterLink to="/world" 
                      :class="{active: isActive('/world')}"
                      :aria-current="isActive('/world') ? 'page' : undefined">
            {{ $t('nav.world') }}
          </RouterLink>
        </nav>
      </div>

      <!-- Controls Box -->
      <div class="controls-box">
        <SearchBox />
        <LanguageSwitcher />
        <button class="chip bgm-button" 
                :class="{playing: isPlaying, paused: !isPlaying}" 
                @click="toggleBGM" 
                :aria-label="isPlaying ? $t('header.pauseBgm') : $t('header.playBgm')"
                :title="isPlaying ? $t('header.pauseBgm') : $t('header.playBgm')">
          <span class="music-icon" aria-hidden="true">♪</span>
          <span class="sr-only">{{ isPlaying ? $t('header.musicPlaying') : $t('header.musicPaused') }}</span>
        </button>
        <button class="avatar" 
                :aria-label="$t('accessibility.openUserMenu')" 
                @click="showLogin = true"
                :title="$t('header.login')">
          <img :src="baseUrl + 'images/btn-login.png'" alt="" role="presentation" />
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
import { useI18n } from 'vue-i18n'
import LoginModal from './LoginModal.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import SearchBox from './SearchBox.vue'

const route = useRoute()
const { t } = useI18n()

// Base URL for assets
const baseUrl = import.meta.env.BASE_URL

// BGM functionality
const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)

// Login functionality
const showLogin = ref(false)

const isActive = (p:string) => route.path === p

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
      alert(t('errors.videoLoad.description'))
    })
  }
}

onUnmounted(() => {
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
  flex-shrink:0;
  min-width:0;
}

/* Language Dropdown */
.language-dropdown{
  position:relative;
  flex-shrink:0;
}

.language-dropdown .chip{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  cursor:pointer;
  transition:all 0.3s ease;
  min-width:50px;
  width:50px;
  text-align:center;
  font-size:12px;
  font-weight:600;
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
  right:0;
  background:rgba(0,0,0,.9);
  border:1px solid color-mix(in oklab,var(--gold) 30%, transparent);
  border-radius:6px;
  backdrop-filter:blur(12px);
  margin-top:4px;
  padding:8px 0;
  z-index:100;
  animation:dropdownFade 0.3s ease;
  min-width:150px;
  white-space:nowrap;
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
  background:rgba(0,0,0,.3);
  border-radius:6px;
  color:var(--parchment);
  padding:6px 12px;
  font-size:12px;
  font-weight:500;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  flex-shrink:0;
  backdrop-filter:blur(8px);
}

.avatar{
  width:32px;
  height:32px;
  border-radius:50%;
  border:1px solid color-mix(in oklab,var(--gold) 30%, transparent);
  background:rgba(0,0,0,.3);
  padding:0;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:all 0.3s ease;
  flex-shrink:0;
  backdrop-filter:blur(8px);
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