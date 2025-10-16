<template>
  <div class="skip-links" aria-label="Skip navigation links">
    <a href="#main-content" class="skip-link" @click="focusMain">
      Bỏ qua điều hướng, đến nội dung chính
    </a>
    <a href="#navigation" class="skip-link" @click="focusNav">
      Đến menu điều hướng
    </a>
  </div>
</template>

<script setup lang="ts">
const focusMain = (e: Event) => {
  e.preventDefault()
  const main = document.getElementById('main-content')
  if (main) {
    main.focus()
    main.scrollIntoView({ behavior: 'smooth' })
  }
}

const focusNav = (e: Event) => {
  e.preventDefault()
  const nav = document.getElementById('navigation')
  if (nav) {
    nav.focus()
    nav.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 10000;
}

.skip-link {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  background: #c4ac7d;
  color: #1a1a1a;
  padding: 0.75rem 1rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 8px 8px;
  transition: all 0.3s ease;
}

.skip-link:focus {
  position: static;
  left: auto;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
}

.skip-link:hover,
.skip-link:focus {
  background: #d4c190;
  outline: 2px solid #c4ac7d;
  outline-offset: 2px;
}
</style>