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
  min-height: 100vh;
  padding: 100px 20px 80px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.characters-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
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