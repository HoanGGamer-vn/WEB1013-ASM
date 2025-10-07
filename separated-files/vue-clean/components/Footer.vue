<template>
  <footer class="site-footer">
    <div class="container">© {{ year }} Error404</div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped src="../../../separated-files/css/components/Footer.css">
/* CSS đã được tách ra file riêng */
</style>