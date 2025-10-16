<template>
  <section class="hero">
    <!-- Background Video -->
    <video 
      class="bg-video" 
      autoplay 
      muted 
      loop 
      playsinline
      preload="metadata"
      crossorigin="anonymous"
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
      @canplay="onVideoCanPlay"
    >
      <source src="/video/bg-home.mp4" type="video/mp4">
      <!-- Fallback message -->
      Trình duyệt của bạn không hỗ trợ video HTML5.
    </video>
    <!-- Fallback background image -->
    <div class="bg-fallback" :class="{ 'show': showFallback }"></div>
    <div class="overlay"></div>
    <div class="noise"></div>

    <button class="play" aria-label="Play trailer" @click="playTrailer"></button>

    <!-- Video Modal -->
    <div v-if="showVideo" class="video-overlay" @click="closeVideo">
      <div class="video-container" @click.stop>
        <button class="close-video" @click="closeVideo">×</button>
        <div v-if="videoError" class="video-error">
          <h3>🎬 Trailer không thể phát</h3>
          <p>Nhấn để thử lại hoặc mở trong tab mới:</p>
          <button @click="openInNewTab" class="retry-btn">Mở YouTube</button>
        </div>
        <iframe 
          v-else
          :src="videoUrl"
          frameborder="0" 
          allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          width="800"
          height="450"
          title="Game Trailer"
          @error="handleVideoError"
        ></iframe>
      </div>
    </div>

    <SocialBar />
    <PatchBanner />
    <DownloadStrip />
    
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SocialBar from '@/components/common/SocialBar.vue'
import PatchBanner from '@/components/common/PatchBanner.vue'
import DownloadStrip from '@/components/home/DownloadStrip.vue'

// Background video functionality
const showFallback = ref(true) // Start with fallback until video loads

// Video trailer functionality
const showVideo = ref(false)
const videoUrl = ref('')
const videoError = ref(false)

const playTrailer = () => {
  // URL trailer video với parameters để bypass restrictions
  const workingUrls = [
    'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=' + window.location.origin,
    'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=' + window.location.origin,
    'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=' + window.location.origin
  ]
  
  // Try first URL (nocookie version is less restricted)
  videoUrl.value = workingUrls[0]
  showVideo.value = true
  videoError.value = false
  
  if (location.hostname === 'localhost') {
    console.log('Playing trailer video...', videoUrl.value)
  }
}

const closeVideo = () => {
  showVideo.value = false
  videoUrl.value = ''
  videoError.value = false
}

const handleVideoError = () => {
  console.error('Video failed to load')
  videoError.value = true
}

const openInNewTab = () => {
  window.open('https://www.youtube.com/watch?v=ScMzIvxBSi4', '_blank')
  closeVideo()
}

// Background video handlers
const onVideoLoaded = () => {
  if (location.hostname === 'localhost') {
    console.log('Background video loaded successfully from /video/bg-home.mp4')
  }
  showFallback.value = false
}

const onVideoCanPlay = () => {
  if (location.hostname === 'localhost') {
    console.log('Background video can start playing')
  }
  showFallback.value = false
}

const onVideoError = (event: Event) => {
  if (location.hostname === 'localhost') {
    console.warn('Background video failed to load, showing fallback image', event)
  }
  showFallback.value = true
}

</script>

<style scoped>
.hero{position:relative;height:100vh;overflow:hidden;margin:0;padding:0}

/* Background Video */
.bg-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:1;
}

/* Fallback Background Image */
.bg-fallback{
  position:absolute;
  inset:0;
  background:url('./images/bg-home.png') center/cover no-repeat;
  z-index:1;
  opacity:0;
  transition:opacity 0.5s ease;
}

.bg-fallback.show{
  opacity:1;
}
.overlay{position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 45%,rgba(196,172,125,.22) 0%,transparent 70%);mix-blend-mode:soft-light;z-index:2}
.noise{position:absolute;inset:0;background:url('./images/noise.png') repeat;opacity:.12;pointer-events:none;z-index:3}

.play{
  position:absolute;
  left:50%;
  top:45%;
  transform:translate(-50%,-50%);
  width:64px;
  height:64px;
  border-radius:50%;
  cursor:pointer;
  border:1px solid color-mix(in oklab,var(--gold) 60%, transparent);
  background:rgba(0,0,0,.4);
  z-index:60;
  transition:all 0.3s ease;
}

.play::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-45%,-50%);
  border-left:16px solid var(--gold);
  border-top:10px solid transparent;
  border-bottom:10px solid transparent;
}

.play:hover{
  transform:translate(-50%,-50%) scale(1.06);
}

/* Video Modal */
.video-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.9);
  backdrop-filter:blur(8px);
  z-index:1000;
  display:flex;
  align-items:center;
  justify-content:center;
  animation:fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity:0; }
  to { opacity:1; }
}

.video-container{
  position:relative;
  width:min(90vw, 800px);
  height:min(90vh, 450px);
  background:#000;
  border-radius:12px;
  overflow:hidden;
  border:1px solid var(--gold);
  animation:slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity:0; transform:translateY(30px) scale(0.9); }
  to { opacity:1; transform:translateY(0) scale(1); }
}

.video-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--parchment);
  text-align: center;
  padding: 2rem;
}

.video-error h3 {
  color: var(--gold);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.video-error p {
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.retry-btn {
  padding: 0.8rem 1.5rem;
  background: var(--gold);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #d4bc8d;
  transform: translateY(-2px);
}

.close-video{
  position:absolute;
  top:10px;
  right:10px;
  background:rgba(0,0,0,0.7);
  border:none;
  color:white;
  font-size:24px;
  width:40px;
  height:40px;
  border-radius:50%;
  cursor:pointer;
  z-index:10;
  transition:all 0.3s ease;
}

.close-video:hover{
  background:rgba(255,255,255,0.2);
  color:var(--gold);
  transform:scale(1.1);
}

.video-container iframe{
  width:100%;
  height:100%;
  border:none;
}

/* Mobile responsive for video */
@media (max-width: 768px) {
  .video-container{
    width:95vw;
    height:56.25vw; /* 16:9 aspect ratio */
    max-height:90vh;
  }
}
</style>
