<template>
  <Header />
  <main><RouterView /></main>
  <Footer />
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
</script>
