<template>
  <section class="regions-section" :class="{ 'section-loaded': isLoaded }">
    <!-- Animated Background Effects -->
    <div class="animated-bg">
      <div class="floating-particles">
        <span v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></span>
      </div>
      <div class="magic-circles">
        <div class="magic-circle circle-1"></div>
        <div class="magic-circle circle-2"></div>
        <div class="magic-circle circle-3"></div>
      </div>
    </div>

    <!-- Header với tiêu đề bằng hình ảnh -->
    <div class="section-title" :class="{ 'title-animate': isLoaded }">
      <div class="title-glow-bg"></div>
      <img class="title-image" src="/images/img_bane.png" alt="New Regions" />
      <div class="title-rays"></div>
    </div>

    <!-- Carousel container -->
    <div class="regions-carousel" :class="{ 'carousel-animate': isLoaded }">
      <!-- Ảnh phụ trái -->
      <div 
        class="slide side-slide left-slide" 
        :class="{ 'slide-animate': isLoaded, 'slide-transitioning': isTransitioning }"
        @click="selectSlide(getPrevIndex())"
      >
        <div class="slide-overlay"></div>
        <div class="slide-border-glow"></div>
        <img 
          :src="regions[getPrevIndex()]?.image" 
          :alt="regions[getPrevIndex()]?.name" 
          class="main-img"
        />
        <div class="slide-hover-effect">
          <div class="hover-text">{{ regions[getPrevIndex()]?.name }}</div>
        </div>
      </div>

      <!-- Ảnh chính ở giữa -->
      <div class="slide main-slide active" :class="{ 'slide-animate': isLoaded, 'slide-transitioning': isTransitioning }">
        <div class="main-slide-frame">
          <div class="frame-corner tl"></div>
          <div class="frame-corner tr"></div>
          <div class="frame-corner bl"></div>
          <div class="frame-corner br"></div>
        </div>
        <div class="main-slide-glow"></div>
        <img 
          :src="currentRegion.image" 
          :alt="currentRegion.name" 
          class="main-img"
        />
        <div class="slide-progress">
          <div class="progress-bar" :style="{ width: `${((currentIndex + 1) / regions.length) * 100}%` }"></div>
        </div>
      </div>

      <!-- Ảnh phụ phải -->
      <div 
        class="slide side-slide right-slide" 
        :class="{ 'slide-animate': isLoaded, 'slide-transitioning': isTransitioning }"
        @click="selectSlide(getNextIndex())"
      >
        <div class="slide-overlay"></div>
        <div class="slide-border-glow"></div>
        <img 
          :src="regions[getNextIndex()]?.image" 
          :alt="regions[getNextIndex()]?.name" 
          class="main-img"
        />
        <div class="slide-hover-effect">
          <div class="hover-text">{{ regions[getNextIndex()]?.name }}</div>
        </div>
      </div>
    </div>

    <!-- Region Info & Navigation Container -->
    <div class="region-container" :class="{ 'info-animate': isLoaded }">
      <div class="region-info">
        <h3 class="region-name" :key="currentRegion.id">
          <span v-for="(char, index) in currentRegion.name" :key="index" 
                class="char-animate" 
                :style="{ animationDelay: index * 0.1 + 's' }">
            {{ char === ' ' ? '\u00A0' : char }}
          </span>
        </h3>
        <p class="region-desc" :key="currentRegion.id + '-desc'">
          {{ currentRegion.description }}
        </p>
      </div>
      
      <div class="region-nav">
        <button 
          class="nav-btn prev-btn" 
          @click="previousSlide"
        >
          <div class="btn-bg"></div>
          <span class="btn-icon">←</span>
          <div class="btn-ripple"></div>
        </button>
        <button 
          class="nav-btn next-btn" 
          @click="nextSlide"
        >
          <div class="btn-bg"></div>
          <span class="btn-icon">→</span>
          <div class="btn-ripple"></div>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RegionsSection',
  props: {
    regions: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: 'Border Mountains',
description: "A precipitous mountain range that marks the border of Septimont. The craggy peaks form a natural barrier between Septimont and the outside world. During the first outbreak of the Dark Tide, the Border Mountains bore the brunt, leaving them forever scarred by ashen traces and Tidal Blight calcification.",
          image: '/images/'
        },
        {
          id: 2,
          name: 'Crystal Caverns',
          description: 'Underground caves sparkling with precious crystals and dangerous monsters lurking in the shadows.',
          image: '/images/regions/crystal-caverns.jpg'
        },
        {
          id: 3,
          name: 'Floating Islands',
          description: 'Sky-high islands connected by mystical bridges, home to aerial creatures and wind magic.',
          image: '/images/regions/floating-islands.jpg'
        },
        {
          id: 4,
          name: 'Volcanic Peaks',
          description: 'Treacherous mountains with active volcanoes, inhabited by fire elementals and lava beasts.',
          image: '/images/regions/volcanic-peaks.jpg'
        }
      ]
    }
  },
  data() {
    return {
      currentIndex: 0,
      isLoaded: false,
      isTransitioning: false
    }
  },
  mounted() {
    // Trigger entrance animations
    setTimeout(() => {
      this.isLoaded = true
    }, 200)
  },
  computed: {
    currentRegion() {
      return this.regions[this.currentIndex] || this.regions[0]
    }
  },
  methods: {
    nextSlide() {
      if (this.isTransitioning) return
      this.isTransitioning = true
      
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.regions.length
      }, 100)
      
      setTimeout(() => {
        this.isTransitioning = false
      }, 800)
    },
    
    previousSlide() {
      if (this.isTransitioning) return
      this.isTransitioning = true
      
      setTimeout(() => {
        this.currentIndex = (this.currentIndex - 1 + this.regions.length) % this.regions.length
      }, 100)
      
      setTimeout(() => {
        this.isTransitioning = false
      }, 800)
    },
    
    selectSlide(index) {
      if (this.isTransitioning || index === this.currentIndex) return
      this.isTransitioning = true
      
      setTimeout(() => {
        this.currentIndex = index
      }, 100)
      
      setTimeout(() => {
        this.isTransitioning = false
      }, 800)
    },
    
    getPrevIndex() {
      return (this.currentIndex - 1 + this.regions.length) % this.regions.length
    },
    
    getNextIndex() {
      return (this.currentIndex + 1) % this.regions.length
    },
    
    getParticleStyle(n) {
      return {
        '--delay': Math.random() * 20 + 's',
        '--duration': (Math.random() * 15 + 10) + 's',
        '--x': Math.random() * 100 + '%',
        '--size': (Math.random() * 3 + 2) + 'px',
        '--opacity': Math.random() * 0.5 + 0.2
      }
    }
  }
}
</script>

<style scoped>
.regions-section {
  background: transparent;
  color: #f2e9da;
  text-align: center;
  padding: 0;
  position: relative;
  z-index: 10;
  opacity: 0;
  transform: translateY(60px);
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.regions-section.section-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Animated Background Effects */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(196, 172, 125, var(--opacity)) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatUp var(--duration) var(--delay) infinite linear;
  left: var(--x);
  bottom: -20px;
  box-shadow: 0 0 10px rgba(196, 172, 125, 0.3);
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
  }
  90% {
    opacity: var(--opacity);
  }
  100% {
    transform: translateY(-110vh) rotate(360deg);
    opacity: 0;
  }
}

.magic-circles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.magic-circle {
  position: absolute;
  border: 1px solid rgba(196, 172, 125, 0.2);
  border-radius: 50%;
  animation: rotateCircle linear infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 10%;
  animation-duration: 30s;
  border-style: dashed;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-duration: 45s;
  animation-direction: reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 60%;
  animation-duration: 60s;
  border-style: dotted;
}

@keyframes rotateCircle {
  0% {
    transform: rotate(0deg);
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.1;
  }
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 15;
  opacity: 0;
  transform: translateY(-40px) scale(0.7);
  transition: all 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.section-title.title-animate {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.title-glow-bg {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(196, 172, 125, 0.15) 0%, transparent 60%);
  animation: titlePulse 4s ease-in-out infinite;
  pointer-events: none;
}

.title-image {
  max-width: 100%;
  width: auto;
  height: 70px;
  object-fit: contain;
  opacity: 1;
  transition: all 0.6s ease;
  position: relative;
  z-index: 20;
  filter: drop-shadow(0 0 25px rgba(196, 172, 125, 0.5));
}

.title-image:hover {
  opacity: 1;
  filter: drop-shadow(0 0 40px rgba(196, 172, 125, 0.8));
  transform: scale(1.08);
}

.title-rays {
  position: absolute;
  width: 200px;
  height: 200px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(196, 172, 125, 0.1) 30deg,
    transparent 60deg,
    rgba(196, 172, 125, 0.1) 90deg,
    transparent 120deg,
    rgba(196, 172, 125, 0.1) 150deg,
    transparent 180deg,
    rgba(196, 172, 125, 0.1) 210deg,
    transparent 240deg,
    rgba(196, 172, 125, 0.1) 270deg,
    transparent 300deg,
    rgba(196, 172, 125, 0.1) 330deg,
    transparent 360deg
  );
  animation: rotateRays 15s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

@keyframes rotateRays {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.regions-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 70px;
  overflow: hidden;
  margin-bottom: 90px;
  height: auto;
  width: 100%;
  max-width: 2400px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 0;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
  perspective: 1000px;
}

.regions-carousel.carousel-animate {
  opacity: 1;
  transform: translateY(0);
}

/* Slide chung */
.regions-carousel .slide {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  opacity: 0;
  transform: scale(0.7) rotateY(60deg);
  transform-style: preserve-3d;
}

.slide.slide-animate {
  opacity: 1;
  transform: scale(1) rotateY(0deg);
}

.slide.slide-transitioning {
  transform: scale(1.05) rotateX(5deg);
  z-index: 10;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.15) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 2;
}

.slide-border-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid transparent;
  border-radius: 17px;
  background: linear-gradient(45deg, rgba(196, 172, 125, 0.4), transparent, rgba(196, 172, 125, 0.4)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.slide-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.hover-text {
  color: #C4AC7D;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

/* Ảnh phụ (trái và phải) */
.side-slide {
  flex: 0 0 36%;
  min-width: 36%;
  max-width: 36%;
  aspect-ratio: 16/9;
  opacity: 0.6;
  filter: brightness(0.7) saturate(0.8);
}

.side-slide:hover {
  opacity: 0.9;
  filter: brightness(1.1) saturate(1.2);
  transform: scale(1.02) rotateY(-3deg);
}

.side-slide:hover .slide-overlay {
  opacity: 1;
}

.side-slide:hover .slide-border-glow {
  opacity: 0.8;
}

.side-slide:hover .slide-hover-effect {
  opacity: 1;
}

.side-slide:hover .hover-text {
  transform: translateY(0);
}

/* Ảnh chính (giữa) */
.main-slide {
  flex: 0 0 45%;
  min-width: 45%;
  max-width: 45%;
  aspect-ratio: 16/9;
  opacity: 1;
  transform: scale(1);
  box-shadow: 
    0 15px 40px rgba(196, 172, 125, 0.3),
    0 5px 15px rgba(196, 172, 125, 0.2),
    inset 0 0 0 2px rgba(196, 172, 125, 0.3);
  cursor: default;
  position: relative;
  animation: mainGlow 4s ease-in-out infinite;
}

.main-slide:hover {
  box-shadow: 
    0 25px 60px rgba(196, 172, 125, 0.4),
    0 10px 25px rgba(196, 172, 125, 0.3),
    inset 0 0 0 2px rgba(196, 172, 125, 0.5);
  transform: scale(1.01);
}

.main-slide-frame {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 18px;
  pointer-events: none;
  z-index: 4;
}

.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #C4AC7D;
}

.frame-corner.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 18px;
}

.frame-corner.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 18px;
}

.frame-corner.bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 18px;
}

.frame-corner.br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 18px;
}

.main-slide-glow {
  position: absolute;
  top: -40px;
  left: -40px;
  right: -40px;
  bottom: -40px;
  background: radial-gradient(circle, rgba(196, 172, 125, 0.2) 0%, transparent 70%);
  border-radius: 35px;
  pointer-events: none;
  animation: pulseMainGlow 6s ease-in-out infinite;
}



.slide-progress {
  position: absolute;
  bottom: 5px;
  left: 15px;
  right: 15px;
  height: 3px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: hidden;
  z-index: 6;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #C4AC7D 0%, #D4BC8D 100%);
  border-radius: 2px;
  transition: width 0.8s ease;
}

@keyframes mainGlow {
  0%, 100% {
    box-shadow: 
      0 15px 40px rgba(196, 172, 125, 0.3),
      0 5px 15px rgba(196, 172, 125, 0.2),
      inset 0 0 0 2px rgba(196, 172, 125, 0.3);
  }
  50% {
    box-shadow: 
      0 20px 50px rgba(196, 172, 125, 0.4),
      0 8px 20px rgba(196, 172, 125, 0.3),
      inset 0 0 0 2px rgba(196, 172, 125, 0.5);
  }
}

@keyframes pulseMainGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
  filter: contrast(1.1) saturate(1.1) brightness(1);
}

.slide:hover .main-img {
  transform: scale(1.08);
  filter: contrast(1.2) saturate(1.3) brightness(1.1);
}

.main-slide .main-img {
  filter: contrast(1.15) saturate(1.2) brightness(1.05);
}

/* Region Container */
.region-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  margin: 30px auto 20px auto;
  gap: 40px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.9s;
}

.region-container.info-animate {
  opacity: 1;
  transform: translateY(0);
}

.region-info {
  flex: 1;
  text-align: left;
}

.region-name {
  color: #C4AC7D;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(196, 172, 125, 0.3);
  overflow: hidden;
  position: relative;
}

.char-animate {
  display: inline-block;
  opacity: 0;
  transform: translateY(50px) rotateX(90deg);
  animation: charReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes charReveal {
  0% {
    opacity: 0;
    transform: translateY(50px) rotateX(90deg);
  }
  60% {
    transform: translateY(-8px) rotateX(0deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

.region-desc {
  color: #b3a688;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.6s forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}



.region-nav {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
}

.nav-btn {
  background: transparent;
  border: 2px solid #C4AC7D;
  color: #C4AC7D;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.2rem;
  min-width: 55px;
  min-height: 50px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(196, 172, 125, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #C4AC7D 0%, #D4BC8D 100%);
  color: #000;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 30px rgba(196, 172, 125, 0.4);
  border-color: #D4BC8D;
}

.nav-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.nav-btn:hover .btn-bg {
  opacity: 1;
}

.btn-icon {
  position: relative;
  z-index: 2;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.nav-btn:hover .btn-icon {
  transform: scale(1.2);
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.8s ease;
  pointer-events: none;
  z-index: 1;
}

.nav-btn:hover .btn-ripple {
  width: 300%;
  height: 300%;
}

/* Removed disabled styles since buttons now loop */

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    margin-top: 10px;
    margin-bottom: 40px;
  }
  
  .title-image {
    height: 50px;
    max-width: 90%;
  }

  .title-glow-bg {
    width: 300px;
    height: 300px;
  }

  .particle {
    animation-duration: calc(var(--duration) * 0.8);
  }

  .magic-circle {
    animation-duration: calc(var(--duration) * 0.7);
  }
  
  .regions-carousel {
    gap: 25px; /* Tăng gap cho tablet */
    height: auto;
    flex-direction: row; /* Giữ layout ngang */
    padding: 15px 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .side-slide {
    flex: 0 0 34%; /* Tăng từ 32% lên 34% cho tablet */
    min-width: 34%;
    max-width: 34%;
  }
  
  .main-slide {
    flex: 0 0 40%; /* Tăng từ 35% lên 40% cho tablet */
    min-width: 40%;
    max-width: 40%;
  }
  
  .region-container {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .region-info {
    text-align: center;
  }
  
  .region-name {
    font-size: 1.3rem;
  }
  
  .region-desc {
    font-size: 0.9rem;
    padding: 0 20px;
  }
  
  .region-nav {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .regions-section {
    padding: 60px 0;
  }
  
  .section-title {
    margin-top: 5px; /* Đảm bảo không bị che trên mobile */
    margin-bottom: 30px;
  }
  
  .title-image {
    height: 40px;
    max-width: 95%;
  }
  
  .regions-carousel {
    height: auto;
    gap: 15px; /* Tăng gap cho mobile */
    padding: 10px 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .side-slide {
    flex: 0 0 32%; /* Tăng từ 30% lên 32% cho mobile */
    min-width: 32%;
    max-width: 32%;
  }
  
  .main-slide {
    flex: 0 0 36%; /* Tăng từ 33% lên 36% cho mobile */
    min-width: 36%;
    max-width: 36%;
  }
  
  .region-container {
    margin: 20px auto 30px auto;
    gap: 15px;
  }
  
  .region-nav {
    gap: 15px;
  }
  
  .nav-btn {
    padding: 8px 12px;
    font-size: 1rem;
    min-width: 45px;
    min-height: 40px;
  }

  .title-glow-bg {
    width: 250px;
    height: 250px;
  }

  .region-badge {
    bottom: 8px;
    left: 8px;
    right: 8px;
    padding: 8px 12px;
  }

  .badge-text {
    font-size: 0.9rem;
  }
}
</style>