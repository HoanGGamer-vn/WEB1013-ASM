<template>
  <div class="external-widgets-simple">
    <!-- Chat Widget Toggle -->
    <button 
      class="widget-toggle chat-toggle" 
      @click="toggleChat"
      :class="{ active: showChat }"
      title="Live Chat Support"
    >
      <span>💬 Chat</span>
    </button>

    <!-- Social Widgets Toggle -->
    <button 
      class="widget-toggle social-toggle" 
      @click="toggleSocial"
      :class="{ active: showSocial }"
      title="Social Media Widgets"
    >
      <span>📱 Social</span>
    </button>

    <!-- Chat Widget Panel -->
    <div v-if="showChat" class="chat-widget-simple">
      <div class="widget-header">
        <h3>💬 Live Chat</h3>
        <button @click="toggleChat" class="close-btn">✕</button>
      </div>
      <div class="widget-content">
        <div class="chat-messages">
          <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
            <div class="message-content">
              <div class="message-text">
                <strong>{{ msg.type === 'bot' ? '🤖 Support Bot' : '👤 Bạn' }}:</strong>
                {{ msg.text }}
              </div>
              <div class="message-time">{{ formatTime(msg.time) }}</div>
            </div>
          </div>
          
          <!-- Typing indicator -->
          <div v-if="isTyping" class="message bot typing">
            <div class="message-content">
              <div class="message-text">
                <strong>🤖 Support Bot:</strong>
                <span class="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input 
            v-model="message" 
            @keyup.enter="sendMessage"
            :disabled="isTyping"
            placeholder="Nhập tin nhắn và nhấn Enter..." 
          />
          <button @click="sendMessage" :disabled="!message.trim() || isTyping">
            {{ isTyping ? '⏳' : 'Gửi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Social Widget Panel -->
    <div v-if="showSocial" class="social-widget-simple">
      <div class="widget-header">
        <h3>📱 Social Media</h3>
        <button @click="toggleSocial" class="close-btn">✕</button>
      </div>
      <div class="widget-content">
        
        <!-- Facebook Section -->
        <div class="social-section">
          <h4>📘 Facebook</h4>
          <div class="social-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php?u=http://localhost:5173" target="_blank" class="social-btn facebook">
              👍 Share on Facebook
            </a>
            <a href="https://www.facebook.com/wutheringwaves" target="_blank" class="social-btn facebook">
              📘 Like Our Page
            </a>
          </div>
        </div>

        <!-- Twitter Section -->
        <div class="social-section">
          <h4>🐦 Twitter</h4>
          <div class="social-buttons">
            <a href="https://twitter.com/wutheringwaves" target="_blank" class="social-btn twitter">
              🐦 Follow @WutheringWaves
            </a>
            <a href="https://twitter.com/intent/tweet?url=http://localhost:5173&text=Check out this awesome game!" target="_blank" class="social-btn twitter">
              📤 Tweet About Us
            </a>
          </div>
        </div>

        <!-- YouTube Section -->
        <div class="social-section">
          <h4>📺 YouTube</h4>
          <div class="social-buttons">
            <a href="https://www.youtube.com/channel/UCmhHfrugIFJhQM4bEFbXGaQ?sub_confirmation=1" target="_blank" class="social-btn youtube">
              📺 Subscribe Channel
            </a>
          </div>
          <!-- Simple YouTube video embed -->
          <div class="youtube-embed">
            <iframe 
              width="280" 
              height="157" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="YouTube video" 
              frameborder="0" 
              allowfullscreen>
            </iframe>
          </div>
        </div>

        <!-- Discord Section -->
        <div class="social-section">
          <h4>🎮 Discord</h4>
          <div class="social-buttons">
            <a href="https://discord.gg/wutheringwaves" target="_blank" class="social-btn discord">
              🎮 Join Discord Server
            </a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// State
const showChat = ref(false)
const showSocial = ref(false)
const message = ref('')
const isTyping = ref(false)
const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: 'Chào bạn! Tôi là Bot hỗ trợ Error404. Tôi có thể giúp gì cho bạn?',
    time: new Date()
  }
])

// Methods
const toggleChat = () => {
  console.log('💬 Chat toggled!')
  showChat.value = !showChat.value
  if (showChat.value) {
    showSocial.value = false
  }
}

const toggleSocial = () => {
  console.log('📱 Social toggled!')
  showSocial.value = !showSocial.value
  if (showSocial.value) {
    showChat.value = false
  }
}

const sendMessage = () => {
  if (!message.value.trim()) return
  
  console.log('📤 Message sent:', message.value)
  
  // Add user message
  const userMessage = {
    id: Date.now(),
    type: 'user',
    text: message.value.trim(),
    time: new Date()
  }
  
  messages.value.push(userMessage)
  const userText = message.value.toLowerCase()
  message.value = ''
  
  // Show typing indicator
  isTyping.value = true
  
  // Auto bot response after delay
  setTimeout(() => {
    isTyping.value = false
    
    let botResponse = 'Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận tin nhắn của bạn.'
    
    // Smart responses based on keywords
    if (userText.includes('hello') || userText.includes('hi') || userText.includes('chào')) {
      botResponse = 'Chào bạn! Rất vui được gặp bạn. Bạn cần hỗ trợ gì không?'
    } else if (userText.includes('bug') || userText.includes('lỗi') || userText.includes('error')) {
      botResponse = 'Tôi hiểu bạn đang gặp lỗi. Bạn có thể mô tả chi tiết vấn đề để tôi hỗ trợ tốt hơn không?'
    } else if (userText.includes('game') || userText.includes('wuthering') || userText.includes('nhân vật')) {
      botResponse = 'Về game Wuthering Waves, bạn có thể xem thông tin chi tiết ở các tab Character, World, Story nhé!'
    } else if (userText.includes('tài khoản') || userText.includes('account') || userText.includes('đăng nhập')) {
      botResponse = 'Về vấn đề tài khoản, bạn hãy kiểm tra email hoặc thử reset password. Nếu vẫn lỗi thì liên hệ support@error404.com nhé!'
    } else if (userText.includes('cảm ơn') || userText.includes('thank')) {
      botResponse = 'Không có gì! Tôi luôn sẵn sàng hỗ trợ bạn. Chúc bạn có trải nghiệm tuyệt vời! 🎮'
    } else if (userText.includes('bye') || userText.includes('tạm biệt')) {
      botResponse = 'Tạm biệt bạn! Hẹn gặp lại và chúc bạn chơi game vui vẻ! 👋'
    }
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: botResponse,
      time: new Date()
    }
    
    messages.value.push(botMessage)
    scrollToBottom()
  }, 1500) // 1.5 second delay to simulate thinking
}

const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.querySelector('.chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}
</script>

<style scoped>
.external-widgets-simple {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.widget-toggle {
  padding: 12px 16px;
  background: linear-gradient(135deg, #c4ac7d, #d4c190);
  border: none;
  border-radius: 25px;
  color: #1a1a1a;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(196, 172, 125, 0.3);
}

.widget-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(196, 172, 125, 0.4);
}

.widget-toggle.active {
  background: linear-gradient(135deg, #d4c190, #c4ac7d);
}

.chat-widget-simple,
.social-widget-simple {
  width: 350px;
  max-height: 500px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(0, 0, 0, 0.95));
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  overflow: hidden;
  margin-bottom: 10px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(196, 172, 125, 0.1);
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
}

.widget-header h3 {
  color: #c4ac7d;
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.close-btn:hover {
  color: #c4ac7d;
}

.widget-content {
  padding: 20px;
  color: #f2e9da;
  overflow-y: auto;
  max-height: 400px;
}

.chat-messages {
  margin-bottom: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.message {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 85%;
}

.message-text {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.bot .message-text {
  background: rgba(196, 172, 125, 0.2);
  border-bottom-left-radius: 4px;
}

.message.user .message-text {
  background: rgba(66, 165, 245, 0.2);
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.message.bot .message-time {
  text-align: left;
}

/* Typing animation */
.typing-dots {
  display: inline-block;
  margin-left: 5px;
}

.typing-dots span {
  display: inline-block;
  animation: typing-dot 1.4s infinite;
  opacity: 0;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-dot {
  0%, 60%, 100% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 15px;
  color: #f2e9da;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input input:focus {
  border-color: #c4ac7d;
  box-shadow: 0 0 0 2px rgba(196, 172, 125, 0.2);
}

.chat-input input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-input input::placeholder {
  color: rgba(242, 233, 218, 0.5);
}

.chat-input button {
  padding: 8px 16px;
  background: #c4ac7d;
  border: none;
  border-radius: 15px;
  color: #1a1a1a;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.chat-input button:hover:not(:disabled) {
  background: #d4c190;
  transform: translateY(-1px);
}

.chat-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.social-section {
  margin-bottom: 20px;
}

.social-section h4 {
  color: #c4ac7d;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.social-btn {
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.social-btn.facebook {
  background: #1877F2;
}

.social-btn.twitter {
  background: #1DA1F2;
}

.social-btn.youtube {
  background: #FF0000;
}

.social-btn.discord {
  background: #5865F2;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.youtube-embed {
  border-radius: 8px;
  overflow: hidden;
}

.youtube-embed iframe {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .external-widgets-simple {
    right: 10px;
    bottom: 10px;
  }
  
  .chat-widget-simple,
  .social-widget-simple {
    width: calc(100vw - 20px);
    max-width: 350px;
  }
}
</style>