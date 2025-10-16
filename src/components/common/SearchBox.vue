<template>
  <div class="search-container">
    <div class="search-wrapper" :class="{ 'expanded': isExpanded, 'has-results': hasResults }">
      <!-- Search Input -->
      <div class="search-input-wrapper">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="$t('common.search')"
          :aria-label="$t('common.search')"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="isLoading"
        />
        <div class="search-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <button
          v-if="searchQuery"
          class="clear-button"
          @click="clearSearch"
          :aria-label="$t('common.clear')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <!-- Search Results -->
      <Transition name="search-results">
        <div v-if="showResults" class="search-results" role="listbox">
          <!-- Loading State -->
          <div v-if="isLoading" class="search-loading">
            <div class="loading-spinner"></div>
            <span>{{ $t('common.loading') }}</span>
          </div>

          <!-- No Results -->
          <div v-else-if="!hasResults" class="no-results">
            <div class="no-results-icon">🔍</div>
            <p>{{ $t('search.noResults', { query: searchQuery }) }}</p>
            <p class="search-suggestion">{{ $t('search.suggestion') }}</p>
          </div>

          <!-- Results -->
          <div v-else class="results-container">
            <!-- News Results -->
            <div v-if="results.news.length" class="result-section">
              <h3 class="section-title">
                {{ $t('nav.news') }} ({{ results.news.length }})
              </h3>
              <div class="result-items">
                <div
                  v-for="(item, index) in results.news"
                  :key="`news-${item.id}`"
                  class="result-item"
                  :class="{ 'selected': selectedIndex === getItemIndex('news', index) }"
                  @click="selectResult('news', item)"
                  @mouseenter="setSelectedIndex(getItemIndex('news', index))"
                  role="option"
                  :aria-selected="selectedIndex === getItemIndex('news', index)"
                >
                  <div class="item-content">
                    <div class="item-title" v-html="highlightText(item.title)"></div>
                    <div class="item-excerpt" v-html="highlightText(item.excerpt)"></div>
                    <div class="item-meta">
                      <span class="item-type">{{ $t('nav.news') }}</span>
                      <span class="item-date">{{ formatDate(item.publishedAt) }}</span>
                    </div>
                  </div>
                  <div class="item-image" v-if="item.image?.url">
                    <img :src="item.image.url" :alt="item.image.alt" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Character Results -->
            <div v-if="results.characters.length" class="result-section">
              <h3 class="section-title">
                {{ $t('nav.characters') }} ({{ results.characters.length }})
              </h3>
              <div class="result-items">
                <div
                  v-for="(item, index) in results.characters"
                  :key="`character-${item.id}`"
                  class="result-item character-item"
                  :class="{ 'selected': selectedIndex === getItemIndex('characters', index) }"
                  @click="selectResult('character', item)"
                  @mouseenter="setSelectedIndex(getItemIndex('characters', index))"
                  role="option"
                  :aria-selected="selectedIndex === getItemIndex('characters', index)"
                >
                  <div class="item-content">
                    <div class="item-title" v-html="highlightText(item.name)"></div>
                    <div class="item-excerpt" v-html="highlightText(item.title)"></div>
                    <div class="item-meta">
                      <span class="item-type">{{ $t('nav.characters') }}</span>
                      <span class="character-element">{{ item.element }}</span>
                      <span class="character-rarity">{{ '★'.repeat(item.rarity) }}</span>
                    </div>
                  </div>
                  <div class="item-image" v-if="item.images?.icon">
                    <img :src="item.images.icon" :alt="item.name" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="hasResults" class="search-footer">
            <div class="search-shortcuts">
              <kbd>↑↓</kbd> {{ $t('search.navigate') }}
              <kbd>Enter</kbd> {{ $t('search.select') }}
              <kbd>Esc</kbd> {{ $t('search.close') }}
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Search Overlay -->
    <Transition name="overlay">
      <div v-if="isExpanded" class="search-overlay" @click="closeSearch"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { dataService, type NewsArticle, type Character } from '@/services/dataService'
import { formatDate } from '@/i18n'

interface SearchResults {
  news: NewsArticle[]
  characters: Character[]
}

const router = useRouter()
const { t } = useI18n()

// Refs
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const isExpanded = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(0)
const results = ref<SearchResults>({ news: [], characters: [] })

// Computed
const hasResults = computed(() => {
  return results.value.news.length > 0 || results.value.characters.length > 0
})

const showResults = computed(() => {
  return isExpanded.value && (searchQuery.value.length > 0 || isLoading.value)
})

const totalResults = computed(() => {
  return results.value.news.length + results.value.characters.length
})

// Methods
const handleFocus = () => {
  isExpanded.value = true
  if (searchQuery.value) {
    performSearch()
  }
}

const handleBlur = (e: FocusEvent) => {
  // Don't close if clicking on results
  if (e.relatedTarget && (e.relatedTarget as Element).closest('.search-results')) {
    return
  }
  
  setTimeout(() => {
    isExpanded.value = false
    selectedIndex.value = 0
  }, 200)
}

const handleInput = () => {
  if (searchQuery.value.length > 0) {
    performSearch()
  } else {
    results.value = { news: [], characters: [] }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!showResults.value) return
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (selectedIndex.value < totalResults.value - 1) {
        selectedIndex.value++
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (selectedIndex.value > 0) {
        selectedIndex.value--
      }
      break
    case 'Enter':
      e.preventDefault()
      selectCurrentItem()
      break
    case 'Escape':
      e.preventDefault()
      closeSearch()
      break
  }
}

const performSearch = async () => {
  if (searchQuery.value.length < 2) {
    results.value = { news: [], characters: [] }
    return
  }
  
  isLoading.value = true
  selectedIndex.value = 0
  
  try {
    const [newsResults, characterResults] = await Promise.all([
      dataService.searchNews(searchQuery.value),
      dataService.searchCharacters(searchQuery.value)
    ])
    
    results.value = {
      news: newsResults.slice(0, 5), // Limit to 5 results each
      characters: characterResults.slice(0, 5)
    }
  } catch (error) {
    console.error('Search error:', error)
    results.value = { news: [], characters: [] }
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = { news: [], characters: [] }
  isExpanded.value = false
  searchInput.value?.focus()
}

const closeSearch = () => {
  isExpanded.value = false
  selectedIndex.value = 0
  searchInput.value?.blur()
}

const selectResult = (type: string, item: any) => {
  if (type === 'news') {
    router.push(`/news/${item.slug}`)
  } else if (type === 'character') {
    router.push(`/characters/${item.slug}`)
  }
  closeSearch()
}

const selectCurrentItem = () => {
  const newsLength = results.value.news.length
  
  if (selectedIndex.value < newsLength) {
    selectResult('news', results.value.news[selectedIndex.value])
  } else {
    const charIndex = selectedIndex.value - newsLength
    selectResult('character', results.value.characters[charIndex])
  }
}

const getItemIndex = (type: 'news' | 'characters', index: number): number => {
  if (type === 'news') {
    return index
  }
  return results.value.news.length + index
}

const setSelectedIndex = (index: number) => {
  selectedIndex.value = index
}

const highlightText = (text: string): string => {
  if (!searchQuery.value || !text) return text
  
  // Escape special regex characters in search query
  const escapedQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  
  // Replace matches with marked text, then sanitize the result
  const highlighted = text.replace(regex, '<mark>$1</mark>')
  
  // Sanitize HTML to prevent XSS attacks, allowing only <mark> tags
  return DOMPurify.sanitize(highlighted, { 
    ALLOWED_TAGS: ['mark'],
    ALLOWED_ATTR: []
  })
}

// Watch for search query changes
watch(searchQuery, () => {
  selectedIndex.value = 0
})

// Global click handler to close search
const handleGlobalClick = (e: Event) => {
  if (!searchInput.value?.contains(e.target as Node) && !document.querySelector('.search-results')?.contains(e.target as Node)) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 300px;
}

.search-wrapper {
  position: relative;
  z-index: 1000;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 8px;
  color: #d1d5db;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #c4ac7d;
  box-shadow: 0 0 0 3px rgba(196, 172, 125, 0.2);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  pointer-events: none;
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: #c4ac7d;
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1001;
}

.search-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #9ca3af;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(196, 172, 125, 0.3);
  border-top: 2px solid #c4ac7d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}

.no-results-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.search-suggestion {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.results-container {
  padding: 0.5rem 0;
}

.result-section {
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
}

.result-section:last-child {
  border-bottom: none;
}

.section-title {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #c4ac7d;
  border-bottom: 1px solid rgba(196, 172, 125, 0.1);
  margin: 0;
}

.result-items {
  padding: 0.5rem 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.result-item:hover,
.result-item.selected {
  background: rgba(196, 172, 125, 0.1);
  border-left-color: #c4ac7d;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 600;
  color: #f3f4f6;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.item-title :deep(mark) {
  background: rgba(196, 172, 125, 0.3);
  color: #c4ac7d;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

.item-excerpt {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-excerpt :deep(mark) {
  background: rgba(196, 172, 125, 0.3);
  color: #c4ac7d;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.item-type {
  background: rgba(196, 172, 125, 0.2);
  color: #c4ac7d;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.character-element {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
}

.character-rarity {
  color: #fbbf24;
}

.item-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(196, 172, 125, 0.2);
  background: rgba(0, 0, 0, 0.5);
}

.search-shortcuts {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.search-shortcuts kbd {
  background: rgba(196, 172, 125, 0.2);
  color: #c4ac7d;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 600;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Animations */
.search-results-enter-active,
.search-results-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.95);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    width: 280px;
  }
  
  .search-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .result-item {
    padding: 1rem;
  }
  
  .item-image {
    width: 40px;
    height: 40px;
  }
}
</style>