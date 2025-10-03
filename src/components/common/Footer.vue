<template>
  <footer class="site-footer">
    <div class="container">© {{year}} Error404</div>
  </footer>
</template>
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style scoped>
.site-footer{
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  z-index:40;
  border-top:none;
  color:var(--muted);
  background:rgba(0,0,0,.4);
  backdrop-filter:blur(12px);
  padding:12px 24px;
  margin-top:0;
  text-align:center;
  font-size:16px;
  font-weight:500;
}
</style>
