<template>
  <HomeHero />
</template>
<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
</script>
<style scoped>
.blocks{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:18px;padding:18px}
.card{background:#111;border:1px solid var(--border);border-radius:12px;padding:16px;color:#ddd}
</style>
