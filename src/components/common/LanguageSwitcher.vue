<template>
  <div class="language-switcher" :class="{ open: isOpen }">
    <button 
      class="language-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      :aria-label="$t('accessibility.selectLanguage')"
      aria-haspopup="true"
    >
      <span class="current-flag">{{ currentLanguage.flag }}</span>
      <span class="current-code">{{ currentLanguage.code.toUpperCase() }}</span>
      <span class="arrow" :class="{ rotated: isOpen }" aria-hidden="true">▾</span>
    </button>
    
    <Transition name="dropdown">
      <div 
        v-show="isOpen" 
        class="language-dropdown"
        role="menu"
        :aria-label="$t('accessibility.languageOptions')"
      >
        <button
          v-for="language in availableLanguages"
          :key="language.code"
          class="language-option"
          :class="{ active: language.code === currentLanguage.code }"
          @click="selectLanguage(language.code)"
          role="menuitem"
          :aria-current="language.code === currentLanguage.code ? 'true' : undefined"
        >
          <span class="flag">{{ language.flag }}</span>
          <span class="name">{{ language.name }}</span>
          <span v-if="language.code === currentLanguage.code" class="check" aria-hidden="true">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AVAILABLE_LANGUAGES, setLanguage, getCurrentLanguage, type MessageLanguages } from '@/i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLanguage = computed(() => {
  const current = getCurrentLanguage()
  return AVAILABLE_LANGUAGES.find(lang => lang.code === current) || AVAILABLE_LANGUAGES[0]
})

const availableLanguages = computed(() => AVAILABLE_LANGUAGES)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (langCode: MessageLanguages) => {
  setLanguage(langCode)
  isOpen.value = false
  
  // Emit event for analytics or other components
  const event = new CustomEvent('languageChanged', {
    detail: { language: langCode }
  })
  window.dispatchEvent(event)
}

// Close dropdown when clicking outside
const closeOnClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

// Close on Escape key
const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
  document.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(196, 172, 125, 0.1);
  color: #c4ac7d;
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 80px;
}

.language-trigger:hover {
  background: rgba(196, 172, 125, 0.2);
  border-color: #c4ac7d;
  transform: translateY(-1px);
}

.language-trigger:focus {
  outline: 2px solid #c4ac7d;
  outline-offset: 2px;
}

.current-flag {
  font-size: 1rem;
}

.current-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.arrow {
  transition: transform 0.3s ease;
  font-size: 0.75rem;
  margin-left: auto;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;
  min-width: 180px;
}

.language-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  text-align: left;
}

.language-option:hover {
  background: rgba(196, 172, 125, 0.1);
  color: #c4ac7d;
}

.language-option:focus {
  background: rgba(196, 172, 125, 0.15);
  color: #c4ac7d;
  outline: none;
}

.language-option.active {
  background: rgba(196, 172, 125, 0.2);
  color: #c4ac7d;
}

.language-option .flag {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.language-option .name {
  flex: 1;
  font-weight: 500;
}

.language-option .check {
  color: #10b981;
  font-weight: 700;
  font-size: 0.875rem;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

/* Responsive */
@media (max-width: 768px) {
  .language-trigger {
    padding: 0.5rem;
    min-width: 70px;
  }
  
  .current-code {
    font-size: 0.8rem;
  }
  
  .language-dropdown {
    min-width: 160px;
  }
  
  .language-option {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .language-trigger {
    border-width: 2px;
  }
  
  .language-option.active {
    background: rgba(196, 172, 125, 0.4);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .language-trigger,
  .arrow,
  .language-option,
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }
}
</style>