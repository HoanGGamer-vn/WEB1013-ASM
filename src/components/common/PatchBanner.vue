<template>
  <RouterLink to="/news" class="patch-banner" aria-label="Latest patch notes">
    <div class="patch-image">
      <img :src="featuredNews.image" :alt="featuredNews.title" />
      <div class="patch-badge">{{ badgeText }}</div>
    </div>
    <div class="patch-content">
      <div class="patch-meta">
        <span class="patch-category">{{ getCategoryName(featuredNews.category) }}</span>
        <span class="patch-date">{{ formatDate(featuredNews.date) }}</span>
      </div>
      <h3 class="patch-title">{{ featuredNews.title }}</h3>
      <p class="patch-excerpt">{{ featuredNews.excerpt }}</p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { asset } from '@/utils/asset'

// Featured news data (this should match the data from NewsView)
const featuredNews = {
  id: 1,
  title: 'ERROR404 Version 2.1 - The Quantum Update',
  excerpt: 'Khám phá thế giới quantum mới với nhiều tính năng hấp dẫn, weapon mới và boss fight epic.',
  category: 'updates',
  date: new Date('2024-01-15'),
  readTime: 5,
  image: asset('/images/bg-other.png'),
  featured: true
}

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'updates', name: 'Cập nhật' },
  { id: 'patches', name: 'Bản vá' },
  { id: 'events', name: 'Sự kiện' },
  { id: 'announcements', name: 'Thông báo' },
  { id: 'community', name: 'Cộng đồng' }
]

const badgeText = computed(() => {
  if (featuredNews.category === 'updates') return 'NEW UPDATE'
  if (featuredNews.category === 'patches') return 'HOTFIX'
  if (featuredNews.category === 'events') return 'EVENT'
  return 'FEATURED'
})

const getCategoryName = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : categoryId
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.patch-banner {
  position: absolute;
  right: 32px;
  bottom: 108px;
  width: 360px;
  height: 180px;
  border-radius: 15px;
  border: 1px solid rgba(196, 172, 125, 0.3);
  background: rgba(196, 172, 125, 0.05);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  z-index: 50;
  overflow: hidden;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 140px 1fr;
  text-decoration: none;
  color: var(--parchment);
}

.patch-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  border-color: var(--gold);
}

.patch-image {
  position: relative;
  overflow: hidden;
}

.patch-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.patch-banner:hover .patch-image img {
  transform: scale(1.1);
}

.patch-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--gold);
  color: var(--bg);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

.patch-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.patch-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.patch-category {
  background: rgba(196, 172, 125, 0.2);
  color: var(--gold);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.patch-date {
  font-size: 0.7rem;
  opacity: 0.7;
}

.patch-title {
  font-size: 0.9rem;
  color: var(--gold);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.patch-excerpt {
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.8;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .patch-banner {
    right: 16px;
    bottom: 80px;
    width: 300px;
    height: 160px;
    grid-template-columns: 120px 1fr;
  }
  
  .patch-content {
    padding: 0.8rem;
  }
  
  .patch-title {
    font-size: 0.8rem;
  }
  
  .patch-excerpt {
    font-size: 0.7rem;
  }
}
</style>
