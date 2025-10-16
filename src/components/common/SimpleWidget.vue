<template>
  <div class="simple-widget">
    <button 
      class="simple-button" 
      @click="toggle"
      :style="{ background: isActive ? 'red' : 'blue' }"
    >
      {{ isActive ? 'ACTIVE' : 'CLICK ME' }}
    </button>
    
    <div v-if="isActive" class="simple-panel">
      <h3>Simple Widget Works!</h3>
      <p>This is a test widget to check Vue reactivity.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

const toggle = () => {
  console.log('Simple widget clicked!', isActive.value)
  isActive.value = !isActive.value
  console.log('New state:', isActive.value)
}
</script>

<style scoped>
.simple-widget {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
}

.simple-button {
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.simple-panel {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 300px;
  padding: 20px;
  background: white;
  border: 2px solid #333;
  border-radius: 10px;
  color: black;
}
</style>