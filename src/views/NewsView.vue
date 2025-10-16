<template>
  <div class="news-page">
    <!-- Filter & Search -->
    <section class="news-filters">
      <div class="container">
        <div class="filter-bar">
          <div class="categories">
            <div class="news-title">NEWS</div>
            <button 
              v-for="category in categories" 
              :key="category.id"
              :class="['category-btn', { active: activeCategory === category.id }]"
              @click="filterByCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search news..."
              @input="searchNews"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <!-- Feedback & External Tools -->
          <div class="external-tools">
            <!-- Feedback Button -->
            <button class="feedback-btn" @click="showFeedbackModal = true" title="Feedback & Suggestions">
              <span class="feedback-icon">💬</span>
              <span class="feedback-text">Feedback</span>
            </button>

          </div>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="news-grid">
      <div class="container">
        <div class="news-layout">
          <!-- News List -->
          <div class="news-list">
            <!-- Skeleton Loading -->
            <template v-if="showSkeleton">
              <div v-for="i in 6" :key="`skeleton-${i}`" class="news-item skeleton-item">
                <div class="skeleton-content">
                  <div class="skeleton-badge"></div>
                  <div class="skeleton-title"></div>
                  <div class="skeleton-text"></div>
                  <div class="skeleton-meta">
                    <div class="skeleton-date"></div>
                    <div class="skeleton-id"></div>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- Actual News Items -->
            <template v-else>
              <article 
                v-for="article in filteredNews" 
                :key="article.id"
                :class="['news-item', { active: articleToShow?.id === article.id }]"
                @mouseenter="setHoveredArticle(article)"
                @mouseleave="setHoveredArticle(null)"
                @click="setActiveArticle(article)"
              >
              <div class="news-content">
                <!-- Always visible content -->
                <div class="content-header">
                  <div class="category-badge">{{ getCategoryName(article.category) }}</div>
                  <h3>{{ article.title }}</h3>
                  <div class="meta">
                    <span class="date">{{ formatDate(article.date) }}</span>
                  </div>
                </div>
                
                <!-- Expandable content on hover -->
                <div class="content-expandable">
                  <p class="excerpt">{{ article.excerpt }}</p>
                  <div class="extra-meta">
                    <span class="article-id">#{{ article.id }}</span>
                  </div>
                </div>
              </div>
            </article>
            </template>

            <!-- Load More -->
            <div class="load-more" v-if="hasMoreNews && !showSkeleton">
              <button class="load-more-btn" @click="loadMoreNews" :disabled="loading">
                {{ loading ? 'Loading...' : 'Load More News' }}
              </button>
            </div>
          </div>

          <!-- Preview Sidebar -->
          <div class="news-preview" :class="{ 'has-hover': hoveredArticle }">
            <!-- Skeleton Preview -->
            <div class="preview-content" v-if="showSkeleton">
              <div class="skeleton-preview">
                <div class="skeleton-preview-image"></div>
                <div class="skeleton-preview-overlay">
                  <div class="skeleton-preview-title"></div>
                  <div class="skeleton-preview-btn"></div>
                </div>
              </div>
            </div>
            
            <!-- Article Preview -->
            <div class="preview-content" v-else-if="articleToShow">
              <div class="preview-image">
                <img :src="articleToShow.image" :alt="articleToShow.title" />
                <div class="image-overlay">
                  <h4>{{ articleToShow.title }}</h4>
                  <button class="preview-read-btn" @click="readMore(articleToShow)">Read More</button>
                </div>
              </div>
            </div>
            
            <!-- No articles available -->
            <div class="preview-info" v-else>
              <div class="info-content">
                <div class="info-footer">
                  <p>📰 No news available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </section>
    
    <!-- Feedback Modal -->
    <Transition name="modal">
      <div v-if="showFeedbackModal" class="feedback-modal-overlay" @click="closeFeedbackModal">
        <div class="feedback-modal" @click.stop>
          <div class="modal-header">
            <h3>Feedback & Suggestions</h3>
            <button class="close-btn" @click="closeFeedbackModal">
              <span>✕</span>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="feedback-types">
              <label class="feedback-type-item">
                <input type="radio" v-model="feedbackType" value="suggestion" />
                <span class="radio-custom"></span>
                <span class="type-text">💡 Suggestion</span>
              </label>
              <label class="feedback-type-item">
                <input type="radio" v-model="feedbackType" value="bug" />
                <span class="radio-custom"></span>
                <span class="type-text">🐛 Bug Report</span>
              </label>
              <label class="feedback-type-item">
                <input type="radio" v-model="feedbackType" value="compliment" />
                <span class="radio-custom"></span>
                <span class="type-text">👍 Compliment</span>
              </label>
              <label class="feedback-type-item">
                <input type="radio" v-model="feedbackType" value="other" />
                <span class="radio-custom"></span>
                <span class="type-text">💭 Other</span>
              </label>
            </div>
            
            <div class="feedback-input">
              <label>Your Message</label>
              <textarea 
                v-model="feedbackText" 
                placeholder="Tell us what you think..."
                rows="4"
              ></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="cancel-btn" @click="closeFeedbackModal">
              Cancel
            </button>
            <button class="submit-btn" @click="submitFeedback" :disabled="!feedbackText.trim()">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const activeCategory = ref('all')
const loading = ref(true) // Start with loading state
const currentPage = ref(1)
const itemsPerPage = 6
const showSkeleton = ref(true)
type NewsArticle = {
  id: number
  title: string
  excerpt: string
  category: string
  date: Date
  readTime: number
  image: string
  featured?: boolean
}

const hoveredArticle = ref<NewsArticle | null>(null)
const activeArticle = ref<NewsArticle | null>(null)
const showFeedbackModal = ref(false)
const feedbackType = ref('suggestion')
const feedbackText = ref('')

// Categories
const categories = ref([
  { id: 'all', name: 'All' },
  { id: 'updates', name: 'Updates' },
  { id: 'patches', name: 'Patches' },
  { id: 'events', name: 'Events' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'community', name: 'Community' }
])

// Sample news data
const allNews = ref([
  {
    id: 1,
    title: 'ERROR404 Version 2.1 - The Quantum Update',
    excerpt: 'Explore the new quantum world with exciting features, new weapons and epic boss fights.',
    category: 'updates',
    date: new Date('2024-01-15'),
    readTime: 5,
    image: '/images/bg-other.png',
    featured: true
  },
  {
    id: 2,
    title: 'Lunar New Year Event 2024',
    excerpt: 'Join the Lunar New Year event with exclusive rewards and limited edition skins.',
    category: 'events',
    date: new Date('2024-01-10'),
    readTime: 3,
    image: '/images/bg-home.png'
  },
  {
    id: 3,
    title: 'Hotfix 2.0.5 - Bug Fixes and Performance',
    excerpt: 'Fixed critical bugs, improved performance and optimized game engine.',
    category: 'patches',
    date: new Date('2024-01-08'),
    readTime: 2,
    image: '/images/bg-other.png'
  },
  {
    id: 4,
    title: 'Community Tournament - Championship 2024',
    excerpt: 'Register for the community tournament with total prize pool up to $100,000.',
    category: 'community',
    date: new Date('2024-01-05'),
    readTime: 4,
    image: '/images/bg-home.png'
  },
  {
    id: 5,
    title: 'Server Maintenance Announcement',
    excerpt: 'Server will be under maintenance on Jan 20, 2024 from 2-6 AM for system upgrade.',
    category: 'announcements',
    date: new Date('2024-01-03'),
    readTime: 1,
    image: '/images/bg-other.png'
  },
  {
    id: 6,
    title: 'New Character Class: Shadow Walker',
    excerpt: 'Introducing new character class with high stealth abilities and extreme damage output.',
    category: 'updates',
    date: new Date('2024-01-01'),
    readTime: 6,
    image: '/images/bg-home.png'
  }
])

// Computed properties
const filteredNews = computed(() => {
  let filtered = allNews.value
  
  // Filter by category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(news => news.category === activeCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(news => 
      news.title.toLowerCase().includes(query) ||
      news.excerpt.toLowerCase().includes(query)
    )
  }
  
  // Pagination
  const startIndex = 0
  const endIndex = currentPage.value * itemsPerPage
  return filtered.slice(startIndex, endIndex)
})

const hasMoreNews = computed(() => {
  let filtered = allNews.value
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(news => news.category === activeCategory.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(news => 
      news.title.toLowerCase().includes(query) ||
      news.excerpt.toLowerCase().includes(query)
    )
  }
  
  return filtered.length > currentPage.value * itemsPerPage
})

// Computed property for article to show (priority: hover > active > latest)
const articleToShow = computed(() => {
  if (hoveredArticle.value) {
    return hoveredArticle.value
  }
  
  if (activeArticle.value) {
    return activeArticle.value
  }
  
  // Show latest article (sorted by date descending)
  if (filteredNews.value.length > 0) {
    const sortedByDate = [...filteredNews.value].sort((a, b) => b.date.getTime() - a.date.getTime())
    return sortedByDate[0]
  }
  
  return null
})

// Methods
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const filterByCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1
}

const searchNews = () => {
  currentPage.value = 1
}

const loadMoreNews = () => {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    currentPage.value++
    loading.value = false
  }, 1000)
}

const setHoveredArticle = (article: any) => {
  hoveredArticle.value = article
}

const setActiveArticle = (article: any) => {
  activeArticle.value = article
}

const readMore = (article: any) => {
  // Navigate to article detail page
  // For now, just console log - can implement router push later
  console.log('Reading article:', article.title)
  // Example: router.push(`/news/${article.id}`)
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : categoryId
}

// Feedback methods
const closeFeedbackModal = () => {
  showFeedbackModal.value = false
  feedbackText.value = ''
  feedbackType.value = 'suggestion'
}

const submitFeedback = () => {
  if (!feedbackText.value.trim()) return
  
  // Simulate feedback submission
  console.log('Feedback submitted:', {
    type: feedbackType.value,
    message: feedbackText.value,
    page: 'news',
    timestamp: new Date().toISOString()
  })
  
  // Show success message (you can implement a toast notification here)
  alert('Thank you for your feedback! We will review and improve.')
  
  closeFeedbackModal()
}

onMounted(() => {
  console.log('NewsView mounted with', allNews.value.length, 'articles')
  
  // Simulate loading data
  setTimeout(() => {
    showSkeleton.value = false
    loading.value = false
  }, 1500) // Show skeleton for 1.5 seconds
})
</script>

<style scoped>
.news-page {
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(196, 172, 125, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(196, 172, 125, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(196, 172, 125, 0.02) 0%, transparent 50%),
    linear-gradient(135deg, rgba(196, 172, 125, 0.01) 0%, rgba(11, 11, 11, 0.8) 100%),
    var(--bg);
  color: var(--parchment);
  padding-top: 53px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.news-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 50px,
      rgba(196, 172, 125, 0.005) 52px,
      rgba(196, 172, 125, 0.005) 54px
    );
  pointer-events: none;
  z-index: 0;
}

.news-page::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle, rgba(196, 172, 125, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: backgroundFloat 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes backgroundFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-2%, -1%) rotate(0.5deg); }
  50% { transform: translate(1%, -2%) rotate(-0.5deg); }
  75% { transform: translate(-1%, 1%) rotate(0.3deg); }
}

/* Filter Bar */
.news-filters {
  padding: 1rem 5rem;
  background: rgba(196, 172, 125, 0.05);
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
  position: relative;
  z-index: 10;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.categories {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.news-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--gold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-right: 3rem;
  position: relative;
}

.news-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), transparent);
}

.category-btn {
  position: relative;
  padding: 0.6rem 1.2rem;
  background: rgba(11, 11, 11, 0.8);
  border: none;
  color: var(--parchment);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
  overflow: hidden;
}

.category-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196, 172, 125, 0.3), transparent);
  transition: left 0.5s ease;
}

.category-btn:hover::before {
  left: 100%;
}

.category-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.category-btn:hover {
  background: rgba(196, 172, 125, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 172, 125, 0.2);
}

.category-btn:hover::after {
  width: 100%;
}

.category-btn.active {
  background: linear-gradient(135deg, var(--gold), #d4bc8d);
  color: var(--bg);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(196, 172, 125, 0.4);
}

.category-btn.active::after {
  width: 100%;
  background: rgba(11, 11, 11, 0.3);
}

.search-box {
  position: relative;
  min-width: 280px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(11, 11, 11, 0.9);
  border: 1px solid rgba(196, 172, 125, 0.2);
  border-radius: 8px;
  color: var(--parchment);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--gold);
  background: rgba(11, 11, 11, 1);
  box-shadow: 0 0 0 2px rgba(196, 172, 125, 0.2);
}

.search-box input::placeholder {
  color: rgba(242, 233, 218, 0.5);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
  font-size: 1.1rem;
  color: var(--gold);
}

/* External Tools */
.external-tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feedback-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.1), rgba(196, 172, 125, 0.05));
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 12px;
  color: var(--gold);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.feedback-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196, 172, 125, 0.2), transparent);
  transition: left 0.5s ease;
}

.feedback-btn:hover::before {
  left: 100%;
}

.feedback-btn:hover {
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.2), rgba(196, 172, 125, 0.1));
  border-color: var(--gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(196, 172, 125, 0.2);
}

.feedback-icon {
  font-size: 1.1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.feedback-text {
  font-size: 0.9rem;
  white-space: nowrap;
}



/* News Grid */
.news-grid {
  padding: 1rem 5rem ;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.news-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 320px);
  max-height: calc(100vh - 320px);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  height: 100%;
  padding-right: 0.5rem;
  background: rgba(196, 172, 125, 0.02);
  border-radius: 15px;
  padding: 1rem;
}

.news-list::-webkit-scrollbar {
  width: 4px;
}

.news-list::-webkit-scrollbar-track {
  background: rgba(196, 172, 125, 0.1);
  border-radius: 2px;
}

.news-list::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 2px;
}

.news-item {
  background: rgba(196, 172, 125, 0.03);
  border: 1px solid rgba(196, 172, 125, 0.1);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.news-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--gold), rgba(196, 172, 125, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-item:hover, .news-item.active {
  background: rgba(196, 172, 125, 0.08);
  border-color: rgba(196, 172, 125, 0.3);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(196, 172, 125, 0.1),
    inset 0 1px 0 rgba(196, 172, 125, 0.1);
}

.news-item:hover::before, .news-item.active::before {
  opacity: 1;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.content-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.content-expandable {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0;
}

.news-item:hover .content-expandable {
  max-height: 120px;
  opacity: 1;
  margin-top: 0.5rem;
}

.category-badge {
  display: inline-block;
  background: var(--gold);
  color: var(--bg);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  width: fit-content;
}

.news-item h3 {
  color: var(--gold);
  font-size: 1rem;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-item .meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.news-item .excerpt {
  line-height: 1.4;
  opacity: 0.8;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.extra-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(196, 172, 125, 0.1);
}

.extra-meta span {
  font-size: 0.75rem;
  opacity: 0.7;
}

.article-id {
  color: var(--parchment);
  font-family: monospace;
}

/* Preview Main Area */
.news-preview {
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.news-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(196, 172, 125, 0.02) 0%,
    transparent 50%,
    rgba(196, 172, 125, 0.01) 100%
  );
  border-radius: 20px;
  pointer-events: none;
  z-index: 1;
}

.preview-content, .preview-placeholder, .preview-info {
  background: rgba(196, 172, 125, 0.05);
  border: 1px solid rgba(196, 172, 125, 0.2);
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Default Info Display */
.preview-info {
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  opacity: 1;
}

.preview-content {
  transform: translateX(0);
  opacity: 1;
}

/* Hide preview-info by default since we always show content */
.preview-info {
  transform: translateX(-100%);
  opacity: 0;
}

.info-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-footer {
  text-align: center;
}

.info-footer p {
  color: var(--gold);
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.preview-image {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(11, 11, 11, 0.9));
  padding: 1.5rem 1rem 1rem;
  color: var(--parchment);
}

.image-overlay h4 {
  color: var(--gold);
  font-size: 1rem;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-read-btn {
  background: var(--gold);
  color: var(--bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.preview-read-btn:hover {
  background: #d4bc8d;
  transform: translateY(-2px);
}

/* Back Button Area */
.back-button-area {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.back-btn {
  background: rgba(196, 172, 125, 0.1);
  color: var(--gold);
  border: 1px solid rgba(196, 172, 125, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.back-btn:hover {
  background: rgba(196, 172, 125, 0.2);
  border-color: var(--gold);
  transform: translateY(-2px);
}

.back-btn span {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.back-btn:hover span {
  transform: translateX(-3px);
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  opacity: 0.6;
}

.placeholder-content span {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.placeholder-content p {
  font-size: 1.1rem;
  margin: 0;
}

/* Skeleton Loading */
.skeleton-item {
  pointer-events: none;
  opacity: 0.7;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-badge,
.skeleton-title,
.skeleton-text,
.skeleton-date,
.skeleton-id {
  background: linear-gradient(90deg, 
    rgba(196, 172, 125, 0.1) 25%, 
    rgba(196, 172, 125, 0.2) 50%, 
    rgba(196, 172, 125, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-badge {
  width: 60px;
  height: 20px;
  border-radius: 10px;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  margin: 0.3rem 0;
}

.skeleton-text {
  width: 90%;
  height: 16px;
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(196, 172, 125, 0.05);
}

.skeleton-date {
  width: 80px;
  height: 14px;
}

.skeleton-id {
  width: 30px;
  height: 14px;
}

/* Skeleton Preview */
.skeleton-preview {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
}

.skeleton-preview-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(196, 172, 125, 0.1) 25%, 
    rgba(196, 172, 125, 0.2) 50%, 
    rgba(196, 172, 125, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem 1rem;
  background: linear-gradient(transparent, rgba(11, 11, 11, 0.9));
}

.skeleton-preview-title {
  width: 70%;
  height: 24px;
  background: linear-gradient(90deg, 
    rgba(196, 172, 125, 0.15) 25%, 
    rgba(196, 172, 125, 0.25) 50%, 
    rgba(196, 172, 125, 0.15) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 0.8rem;
}

.skeleton-preview-btn {
  width: 100px;
  height: 36px;
  background: linear-gradient(90deg, 
    rgba(196, 172, 125, 0.2) 25%, 
    rgba(196, 172, 125, 0.3) 50%, 
    rgba(196, 172, 125, 0.2) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 15px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Load More */
.load-more {
  text-align: center;
}

.load-more-btn {
  position: relative;
  padding: 1rem 2.5rem;
  background: rgba(11, 11, 11, 0.8);
  color: var(--gold);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 1rem;
  overflow: hidden;
}

.load-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196, 172, 125, 0.2), transparent);
  transition: left 0.5s ease;
}

.load-more-btn:hover:not(:disabled)::before {
  left: 100%;
}

.load-more-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--gold), #d4bc8d);
  color: var(--bg);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(196, 172, 125, 0.3);
  border-color: var(--gold);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(11, 11, 11, 0.5);
  color: rgba(242, 233, 218, 0.5);
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    padding: 0 1.5rem;
  }
  
  .news-layout {
    grid-template-columns: 1fr 350px;
    gap: 1rem;
  }
  
  .preview-image {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.3rem;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .categories {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .news-title {
    font-size: 1.8rem;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .category-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .news-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
    height: auto;
  }
  
  .news-list {
    height: 300px;
    order: 1;
  }
  
  .news-preview {
    position: static;
    order: -1;
    height: 300px;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .external-tools {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .feedback-btn {
    justify-content: center;
    padding: 0.6rem 1rem;
  }
  
  .feedback-modal {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .feedback-types {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .cancel-btn, .submit-btn {
    width: 100%;
    padding: 1rem;
  }
  
  .news-item {
    padding: 0.7rem;
  }
  
  .news-item h3 {
    font-size: 1rem;
  }
  
  .back-button-area {
    justify-content: center;
  }
  
  .back-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* Feedback Modal */
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.feedback-modal {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
  background: rgba(196, 172, 125, 0.05);
}

.modal-header h3 {
  color: var(--gold);
  font-size: 1.3rem;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(156, 163, 175, 0.1);
  color: var(--gold);
}

.modal-body {
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.feedback-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.feedback-type-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(196, 172, 125, 0.05);
  border: 1px solid rgba(196, 172, 125, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.feedback-type-item:hover {
  background: rgba(196, 172, 125, 0.1);
  border-color: rgba(196, 172, 125, 0.3);
}

.feedback-type-item input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(196, 172, 125, 0.4);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 8px;
  height: 8px;
  background: var(--gold);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.feedback-type-item input[type="radio"]:checked + .radio-custom {
  border-color: var(--gold);
  background: rgba(196, 172, 125, 0.1);
}

.feedback-type-item input[type="radio"]:checked + .radio-custom::after {
  transform: translate(-50%, -50%) scale(1);
}

.feedback-type-item input[type="radio"]:checked ~ .type-text {
  color: var(--gold);
}

.type-text {
  font-size: 0.9rem;
  color: #e5e7eb;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feedback-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback-input label {
  color: var(--gold);
  font-weight: 500;
  font-size: 0.95rem;
}

.feedback-input textarea {
  padding: 1rem;
  background: rgba(11, 11, 11, 0.8);
  border: 1px solid rgba(196, 172, 125, 0.2);
  border-radius: 12px;
  color: var(--parchment);
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.feedback-input textarea:focus {
  outline: none;
  border-color: var(--gold);
  background: rgba(11, 11, 11, 1);
  box-shadow: 0 0 0 2px rgba(196, 172, 125, 0.2);
}

.feedback-input textarea::placeholder {
  color: rgba(229, 231, 235, 0.5);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(196, 172, 125, 0.2);
  background: rgba(196, 172, 125, 0.02);
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cancel-btn {
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.cancel-btn:hover {
  border-color: #9ca3af;
  color: #d1d5db;
}

.submit-btn {
  background: linear-gradient(45deg, var(--gold), #d4c190);
  color: #1a1a1a;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(196, 172, 125, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modal Animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .feedback-modal,
.modal-leave-to .feedback-modal {
  transform: scale(0.95) translateY(20px);
}

/* Container */
.container {
  width: 100%;
  margin: 0;
  padding: 0 2rem;
}

/* Optimized for larger screens */
@media (min-width: 1800px) {
  .container {
    padding: 0 2rem;
  }
  
  .news-layout {
    grid-template-columns: 450px 1fr;
    gap: 2rem;
  }
}

@media (max-height: 900px) {
  .news-filters {
    padding: 0.8rem 0;
  }
  
  .news-grid {
    padding: 1rem 0;
  }
  
  .news-layout {
    height: 500px;
    max-height: 500px;
  }
  
  .news-list {
    max-height: 500px;
  }
  
  .news-preview {
    height: 180px; /* 16:9 ratio for mobile */
  }
}
</style>
