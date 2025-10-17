<template>
  <div class="world-view" role="main">
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

    <!-- Regions Section -->
    <RegionsSection :regions="worldRegions" />
  </div>
</template>

<script>
import RegionsSection from '@/components/common/RegionsSection.vue'
import { asset } from '@/utils/asset'

export default {
  name: 'WorldView',
  components: {
    RegionsSection
  },
  data() {
    return {
      worldRegions: [
        {
          id: 1,
          name: 'Mystic Forest',
          description: 'A magical forest filled with ancient trees and mysterious creatures. Explore the hidden secrets within the enchanted woods.',
          image: asset('/images/14-4d3e99bc.png')
        },
        {
          id: 2,
          name: 'Capitoline Foothills',
          description: 'An area at the base of Capitoline Hill, near the Borderline Fort. Herds graze in peace throughout lush pastures, and scattered villages nestle among ancient ruins. Yet even in such tranquility, small arenas remain a vital part of life.',
          image: asset('/images/15-dc6f877b.png')
        },
        {
          id: 3,
          name: 'Avinoleum',
          description: 'Once a theological seminary of Rinascita, it now rests in the boundless expanse of clouds. It once recorded Rinascita\'s glory and grandeur, along with countless unspeakable secrets.',
          image: asset('/images/16-24e3dc02.png')
        },
        {
          id: 4,
          name: 'Vault Underground',
          description: 'Tucked beneath the Sea of Clouds lies a vast depository zone of the Averardo Vault. Each item moved to the Vault will be meticulously transported to its designated storage location, where it will be safeguarded with the utmost care and precision.',
          image: asset('/images/09-a6e93cc1.png')
        },
        {
          id: 5,
          name: 'Penitent\'s End',
          description: 'This forsaken island, shrouded in dense sea mist, is dominated by steep cliffs with giant ringed structures. Ships caught in the currents often end up stranded on the island\'s treacherous shores. For those lucky enough to survive the wreck, even greater horrors await...',
          image: asset('/images/03-929d60ff.png')
        }
      ]
    }
  },
  methods: {
    getParticleStyle(index) {
      const size = Math.random() * 4 + 2
      const duration = Math.random() * 20 + 20
      const delay = Math.random() * 20
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`
      }
    }
  }
}
</script>

<style scoped>
.world-view {
  min-height: 100vh;
  padding: 80px 0 40px;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(196, 172, 125, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(196, 172, 125, 0.08) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0f0f0f 100%);
  color: #ffffff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden; /* Ẩn horizontal scroll */
  overflow-y: auto; /* Cho phép vertical scroll */
}

.world-view::before {
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
  position: fixed; /* Đổi từ absolute sang fixed */
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
  position: fixed; /* Đổi từ absolute sang fixed */
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

/* Background Animation */
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

/* Ensure RegionsSection is above background effects */
:deep(.regions-section) {
  position: relative;
  z-index: 2;
  background: transparent !important;
}
</style>
