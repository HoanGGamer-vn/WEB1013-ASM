<template>
  <div id="app" class="app-container">
    <SkipLinks />
    <Header />
    <main id="main-content" tabindex="-1" role="main" aria-label="Main content">
      <RouterView />
    </main>
    <Footer />
    <PWAInstaller />
    <NetworkStatus />
    <ExternalWidgetsSimple />
    <!-- <SimpleWidget /> -->
    <!-- <ExternalWidgets /> -->
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import SkipLinks from '@/components/common/SkipLinks.vue'
import PWAInstaller from '@/components/common/PWAInstaller.vue'
import NetworkStatus from '@/components/common/NetworkStatus.vue'
// import ExternalWidgets from '@/components/common/ExternalWidgets.vue'
// import SimpleWidget from '@/components/common/SimpleWidget.vue'
import ExternalWidgetsSimple from '@/components/common/ExternalWidgetsSimple.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  outline: none;
}

/* Focus management */
*:focus {
  outline: 2px solid #c4ac7d;
  outline-offset: 2px;
}

/* Improve focus visibility for better accessibility */
button:focus,
a:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #c4ac7d;
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-color: currentColor !important;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
