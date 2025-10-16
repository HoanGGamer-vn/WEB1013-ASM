<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-visual">
          <div class="error-code">404</div>
          <div class="error-glitch">ERROR404</div>
        </div>
        
        <h1 class="error-title">Trang Không Tồn Tại</h1>
        <p class="error-description">
          Có vẻ như bạn đã lạc vào vùng đất chưa được khám phá. 
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div class="error-actions">
          <router-link to="/" class="home-btn">
            🏠 Về Trang Chủ
          </router-link>
          <button @click="goBack" class="back-btn">
            ← Quay Lại
          </button>
          <router-link to="/characters" class="explore-btn">
            🎮 Khám Phá Nhân Vật
          </router-link>
        </div>
        
        <div class="quick-links">
          <h3>Có thể bạn đang tìm:</h3>
          <div class="links-grid">
            <router-link to="/news" class="quick-link">📰 Tin Tức</router-link>
            <router-link to="/world" class="quick-link">🌍 Thế Giới</router-link>
            <router-link to="/story" class="quick-link">📖 Câu Chuyện</router-link>
            <router-link to="/characters" class="quick-link">👥 Nhân Vật</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.not-found-content {
  text-align: center;
}

.error-visual {
  position: relative;
  margin-bottom: 3rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(45deg, #ef4444, #c4ac7d);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 0 50px rgba(239, 68, 68, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

.error-glitch {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: 700;
  color: #c4ac7d;
  opacity: 0.8;
  animation: glitch 3s infinite;
}

.error-title {
  font-size: 2.5rem;
  color: #ef4444;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-description {
  font-size: 1.2rem;
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.home-btn,
.back-btn,
.explore-btn {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.home-btn {
  background: linear-gradient(45deg, #c4ac7d, #d4c190);
  color: #1a1a1a;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(196, 172, 125, 0.4);
}

.back-btn {
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid #6b7280;
}

.back-btn:hover {
  background: #6b7280;
  color: white;
  transform: translateY(-2px);
}

.explore-btn {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.explore-btn:hover {
  background: #10b981;
  color: white;
  transform: translateY(-2px);
}

.quick-links {
  max-width: 500px;
  margin: 0 auto;
}

.quick-links h3 {
  color: #c4ac7d;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.quick-link {
  padding: 0.75rem 1rem;
  background: rgba(196, 172, 125, 0.1);
  color: #c4ac7d;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid rgba(196, 172, 125, 0.3);
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.quick-link:hover {
  background: rgba(196, 172, 125, 0.2);
  transform: translateY(-2px);
  border-color: #c4ac7d;
}

/* Animations */
@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
  }
}

@keyframes glitch {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  20% {
    transform: translate(-48%, -52%);
  }
  40% {
    transform: translate(-52%, -48%);
  }
  60% {
    transform: translate(-49%, -51%);
  }
  80% {
    transform: translate(-51%, -49%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  
  .error-glitch {
    font-size: 1.5rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .home-btn,
  .back-btn,
  .explore-btn {
    width: 200px;
  }
  
  .links-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>