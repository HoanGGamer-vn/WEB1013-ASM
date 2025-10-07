<template>
  <div class="characters-page">
    <div class="characters-container">
      <h1>Characters</h1>
      <p>Character content will be built here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Character logic will be added here
</script>

<style scoped>
.characters-page {
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(196, 172, 125, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(196, 172, 125, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(196, 172, 125, 0.02) 0%, transparent 50%),
    linear-gradient(135deg, rgba(196, 172, 125, 0.01) 0%, rgba(11, 11, 11, 0.8) 100%),
    var(--bg);
  color: var(--parchment);
  padding: 100px 20px 80px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.characters-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 50px,
      rgba(196, 172, 125, 0.005) 52px,
      rgba(196, 172, 125, 0.005) 54px
    );
  pointer-events: none;
  z-index: 0;
}

.characters-page::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle, rgba(196, 172, 125, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: backgroundFloat 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes backgroundFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-2%, -1%) rotate(0.5deg); }
  50% { transform: translate(1%, -2%) rotate(-0.5deg); }
  75% { transform: translate(-1%, 1%) rotate(0.3deg); }
}

.characters-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.characters-container h1 {
  color: var(--gold);
  font-size: 3rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.characters-container p {
  color: var(--parchment);
  font-size: 1.2rem;
  opacity: 0.8;
}
</style>