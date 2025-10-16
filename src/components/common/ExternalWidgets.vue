<template>
  <div class="external-widgets">
    <!-- Chat Widget Toggle -->
    <button 
      class="widget-toggle chat-toggle" 
      @click="toggleChat"
      :class="{ active: showChat }"
      title="Live Chat Support"
    >
      <div class="toggle-icon">
        <svg v-if="!showChat" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="toggle-text">{{ showChat ? 'Close' : 'Chat' }}</span>
      <div class="notification-dot" v-if="hasUnreadMessages"></div>
    </button>

    <!-- Social Widgets Toggle -->
    <button 
      class="widget-toggle social-toggle" 
      @click="toggleSocial"
      :class="{ active: showSocial }"
      title="Social Media Widgets"
    >
      <div class="toggle-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5z" stroke="currentColor" stroke-width="2"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" stroke-width="2"/>
          <path d="M17.5 6.5h.01" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <span class="toggle-text">Social</span>
    </button>

    <!-- Debug Test Button -->
    <button 
      class="widget-toggle test-toggle" 
      @click="() => { console.log('Test clicked!'); showSocial = !showSocial; }"
      style="bottom: 130px;"
      title="Test Toggle"
    >
      <div class="toggle-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <span class="toggle-text">Test</span>
    </button>

    <!-- Chat Widget Panel -->
    <Transition name="slide-up">
      <div v-if="showChat" class="chat-widget">
        <div class="chat-header">
          <div class="chat-title">
            <div class="status-indicator online"></div>
            <span>Live Support</span>
          </div>
          <button @click="toggleChat" class="close-chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <div class="chat-content">
          <div class="chat-messages" ref="chatMessages">
            <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
              <div class="message-avatar" v-if="message.type === 'bot'">
                <img src="/icons/bot-avatar.svg" alt="Support" />
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.text }}</div>
                <div class="message-time">{{ formatTime(message.time) }}</div>
              </div>
            </div>
            
            <!-- Typing indicator -->
            <div v-if="isTyping" class="message bot typing">
              <div class="message-avatar">
                <img src="/icons/bot-avatar.svg" alt="Support" />
              </div>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <input 
              v-model="currentMessage"
              @keyup.enter="sendMessage"
              @input="handleTyping"
              placeholder="Type your message..."
              :disabled="isTyping"
            />
            <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Social Media Panel -->
    <Transition name="slide-up">
      <div v-if="showSocial" class="social-widget">
        <div class="social-header">
          <h3>Connect With Us</h3>
          <div class="social-header-buttons">
            <button @click="refreshWidgets" class="refresh-widgets" title="Refresh Widgets">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="toggleSocial" class="close-social">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="social-content">
          <!-- Test Widget Visibility -->
          <div class="social-section test-section">
            <h4>Widget Status</h4>
            <div style="padding: 12px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; color: #22c55e; font-size: 13px;">
              ✅ Social widgets panel is working! Widgets loading below...
            </div>
          </div>

          <!-- Facebook Like/Share -->
          <div class="social-section facebook-section">
            <h4>Facebook</h4>
            <div class="facebook-widgets">
              <!-- Real Facebook Like Plugin -->
              <div class="fb-like" 
                   data-href="https://www.facebook.com/wutheringwaves" 
                   data-width="280" 
                   data-layout="standard" 
                   data-action="like" 
                   data-size="small" 
                   data-share="true"
                   data-show-faces="false">
              </div>
              
              <!-- Fallback Facebook Links -->
              <div class="facebook-fallback" style="margin-top: 8px;">
                <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`" 
                   target="_blank" 
                   style="display: inline-block; padding: 8px 12px; background: #1877F2; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; margin-right: 8px;">
                  📘 Share on Facebook
                </a>
                <a href="https://www.facebook.com/wutheringwaves" 
                   target="_blank" 
                   style="display: inline-block; padding: 8px 12px; background: #1877F2; color: white; text-decoration: none; border-radius: 6px; font-size: 13px;">
                  👍 Like Page
                </a>
              </div>

              <!-- Facebook Comments Plugin -->
              <div class="facebook-comments-wrapper">
                <h5 style="color: var(--gold); font-size: 13px; margin: 12px 0 8px 0;">Bình luận từ Facebook</h5>
                <div class="fb-comments" 
                     data-href="https://www.facebook.com/wutheringwaves" 
                     data-width="280" 
                     data-numposts="3"
                     data-order-by="reverse_time">
                </div>
                <!-- Fallback -->
                <div style="padding: 12px; background: rgba(24, 119, 242, 0.1); border-radius: 8px; text-align: center; color: #9ca3af; font-size: 12px;">
                  💬 Facebook Comments đang được tải...
                </div>
              </div>

              <!-- Facebook Page Plugin -->
              <div class="facebook-page-wrapper">
                <h5 style="color: var(--gold); font-size: 13px; margin: 12px 0 8px 0;">Theo dõi Fanpage</h5>
                <div class="fb-page" 
                     data-href="https://www.facebook.com/wutheringwaves" 
                     data-tabs="timeline" 
                     data-width="280" 
                     data-height="200" 
                     data-small-header="true" 
                     data-adapt-container-width="true" 
                     data-hide-cover="false" 
                     data-show-facepile="true">
                  <blockquote cite="https://www.facebook.com/wutheringwaves" class="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/wutheringwaves">Wuthering Waves</a>
                  </blockquote>
                </div>
              </div>

              <!-- Embedded Facebook Post -->
              <div class="facebook-post-wrapper">
                <h5 style="color: var(--gold); font-size: 13px; margin: 12px 0 8px 0;">Bài đăng mới nhất</h5>
                <div class="fb-post" 
                     data-href="https://www.facebook.com/wutheringwaves/posts/pfbid02uD8..." 
                     data-width="280" 
                     data-show-text="true">
                </div>
              </div>

              <!-- Debug Info -->
              <div class="social-debug" style="margin-top: 16px; padding: 12px; background: rgba(196, 172, 125, 0.1); border-radius: 8px; font-size: 12px; color: #9ca3af;">
                <div><strong style="color: var(--gold);">🔧 Debug Info</strong></div>
                <div>URL: {{ currentUrl.substring(0, 40) }}...</div>
                <div>FB SDK: {{ fbSdkLoaded ? '✅ Loaded' : '⏳ Loading...' }}</div>
                <div>Twitter SDK: {{ typeof (window as any).twttr !== 'undefined' ? '✅ Loaded' : '⏳ Loading...' }}</div>
                <div>YouTube SDK: {{ typeof (window as any).gapi !== 'undefined' ? '✅ Loaded' : '⏳ Loading...' }}</div>
                
                <div style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
                  <button @click="testFacebookSDK" style="padding: 4px 8px; font-size: 10px; background: #1877F2; color: white; border: none; border-radius: 4px;">
                    Test FB
                  </button>
                  <button @click="loadAllSDKs" style="padding: 4px 8px; font-size: 10px; background: var(--gold); color: var(--bg); border: none; border-radius: 4px;">
                    Reload All
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Facebook Messenger Chat Plugin -->
          <div class="social-section messenger-section">
            <h4>Facebook Messenger</h4>
            <div class="messenger-widget">
              <div class="fb-customerchat" 
                   attribution="biz_inbox" 
                   page_id="123456789012345"
                   theme_color="#c4ac7d"
                   logged_in_greeting="Chào bạn! Chúng tôi có thể giúp gì cho bạn?"
                   logged_out_greeting="Chào bạn! Chúng tôi có thể giúp gì cho bạn?">
              </div>
              <div class="messenger-note">
                <small style="color: #9ca3af; font-size: 11px;">
                  💬 Chat trực tiếp với support team qua Facebook Messenger
                </small>
              </div>
            </div>
          </div>

          <!-- Discord Widget -->
          <div class="social-section discord-section">
            <h4>Discord Community</h4>
            <div class="discord-widget">
              <div class="discord-info">
                <div class="discord-icon">
                  <svg width="24" height="24" viewBox="0 0 71 55" fill="none">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
                  </svg>
                </div>
                <div class="discord-text">
                  <div class="discord-title">Error404 Community</div>
                  <div class="discord-members">1,234 members online</div>
                </div>
              </div>
              <a href="https://discord.gg/wutheringwaves" target="_blank" class="discord-join">
                Join Server
              </a>
            </div>
          </div>

          <!-- Twitter Embedded Timeline -->
          <div class="social-section twitter-section">
            <h4>Twitter Timeline</h4>
            <div class="twitter-widget">
              <a class="twitter-timeline" 
                 data-width="280" 
                 data-height="300" 
                 data-theme="dark"
                 data-tweet-limit="3"
                 data-chrome="noheader nofooter noborders transparent"
                 href="https://twitter.com/wutheringwaves?ref_src=twsrc%5Etfw">
                Tweets by Wuthering Waves
              </a>
              
              <!-- Twitter Fallback -->
              <div class="twitter-fallback" style="margin-top: 8px; text-align: center;">
                <a href="https://twitter.com/wutheringwaves" 
                   target="_blank" 
                   style="display: inline-block; padding: 8px 16px; background: #1DA1F2; color: white; text-decoration: none; border-radius: 6px; font-size: 13px;">
                  🐦 Follow @WutheringWaves
                </a>
                <div style="margin-top: 8px; color: #9ca3af; font-size: 11px;">
                  Twitter Timeline đang được tải...
                </div>
              </div>
            </div>
          </div>

          <!-- YouTube Subscribe Widget -->
          <div class="social-section youtube-section">
            <h4>YouTube Channel</h4>
            <div class="youtube-widget">
              <!-- YouTube Subscribe Button -->
              <div class="g-ytsubscribe" 
                   data-channelid="UCmhHfrugIFJhQM4bEFbXGaQ" 
                   data-layout="default" 
                   data-count="default">
              </div>
              
              <!-- YouTube Fallback -->
              <div class="youtube-fallback" style="margin-bottom: 12px;">
                <a href="https://www.youtube.com/channel/UCmhHfrugIFJhQM4bEFbXGaQ?sub_confirmation=1" 
                   target="_blank" 
                   style="display: inline-block; padding: 8px 16px; background: #FF0000; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; width: 100%; text-align: center; box-sizing: border-box;">
                  📺 Subscribe to YouTube Channel
                </a>
              </div>
              
              <!-- Latest Video Embed -->
              <div class="youtube-latest-video">
                <iframe width="280" 
                        height="157" 
                        src="https://www.youtube.com/embed/videoseries?list=UUmhHfrugIFJhQM4bEFbXGaQ" 
                        title="Latest Wuthering Waves Videos" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="social-section links-section">
            <h4>Quick Actions</h4>
            <div class="quick-links">
              <a href="https://reddit.com/r/wutheringwaves" target="_blank" class="quick-link reddit">
                <span class="link-icon">📱</span>
                <span>Join Reddit Community</span>
              </a>
              <a href="https://twitch.tv/wutheringwaves" target="_blank" class="quick-link twitch">
                <span class="link-icon">🎮</span>
                <span>Watch Live Stream</span>
              </a>
              <a href="mailto:support@wutheringwaves.com" class="quick-link email">
                <span class="link-icon">�</span>
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Social Media SDKs type declarations
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void
      }
    }
    twttr?: {
      widgets: {
        load: () => void
      }
    }
    gapi?: {
      load: (api: string) => void
    }
  }
}

// State
const showChat = ref(false)
const showSocial = ref(false)
const currentMessage = ref('')
const isTyping = ref(false)
const hasUnreadMessages = ref(false)
const chatMessages = ref<HTMLElement>()
const fbSdkLoaded = ref(false)

// Chat messages
const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: 'Hello! Welcome to Error404 support. How can I help you today?',
    time: new Date()
  }
])

// Computed
const currentUrl = computed(() => window.location.href)

// Methods
const toggleChat = () => {
  console.log('💬 toggleChat clicked! Current state:', showChat.value)
  try {
    showChat.value = !showChat.value
    console.log('💬 Chat panel toggled to:', showChat.value)
    
    if (showChat.value) {
      showSocial.value = false
      hasUnreadMessages.value = false
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error) {
    console.error('❌ Error in toggleChat:', error)
  }
}

const toggleSocial = () => {
  console.log('🔄 toggleSocial clicked! Current state:', showSocial.value)
  try {
    showSocial.value = !showSocial.value
    console.log('📱 Social panel toggled to:', showSocial.value)
    
    if (showSocial.value) {
      showChat.value = false
      console.log('💬 Chat closed, loading SDKs...')
      // Load all social media SDKs
      loadAllSDKs()
    }
  } catch (error) {
    console.error('❌ Error in toggleSocial:', error)
  }
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return
  
  // Add user message
  const userMessage = {
    id: Date.now(),
    type: 'user',
    text: currentMessage.value.trim(),
    time: new Date()
  }
  
  messages.value.push(userMessage)
  currentMessage.value = ''
  
  // Simulate bot typing and response
  isTyping.value = true
  scrollToBottom()
  
  setTimeout(() => {
    isTyping.value = false
    
    // Auto responses based on keywords
    let botResponse = 'Thank you for your message! Our team will get back to you shortly.'
    
    const userText = userMessage.text.toLowerCase()
    if (userText.includes('bug') || userText.includes('error')) {
      botResponse = 'I understand you\'re experiencing a bug. Please provide more details about the issue and I\'ll help you troubleshoot.'
    } else if (userText.includes('account') || userText.includes('login')) {
      botResponse = 'For account-related issues, please check your email for verification or try resetting your password.'
    } else if (userText.includes('game') || userText.includes('character')) {
      botResponse = 'For game-related questions, you can check our guides section or ask in our Discord community!'
    }
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: botResponse,
      time: new Date()
    }
    
    messages.value.push(botMessage)
    scrollToBottom()
  }, 2000)
}

const handleTyping = () => {
  // Can add typing indicators to other users here
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
}

const initFacebookSDK = () => {
  // Wait for Facebook SDK to be available
  const checkFB = () => {
    if (typeof window.FB !== 'undefined') {
      console.log('✅ Facebook SDK loaded, parsing XFBML...')
      fbSdkLoaded.value = true
      window.FB.XFBML.parse()
    } else {
      console.log('⏳ Waiting for Facebook SDK...')
      setTimeout(checkFB, 500)
    }
  }
  
  // Start checking after a small delay
  setTimeout(checkFB, 500)
}

const loadTwitterSDK = () => {
  if (document.getElementById('twitter-wjs')) return
  
  const script = document.createElement('script')
  script.id = 'twitter-wjs'
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  script.charset = 'utf-8'
  document.head.appendChild(script)
  
  console.log('🐦 Loading Twitter SDK...')
}

const loadYouTubeSDK = () => {
  if (document.querySelector('script[src*="apis.google.com"]')) return
  
  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/platform.js'
  script.async = true
  document.head.appendChild(script)
  
  console.log('📺 Loading YouTube SDK...')
}

const loadAllSDKs = () => {
  loadTwitterSDK()
  loadYouTubeSDK()
  initFacebookSDK()
}

const testFacebookSDK = () => {
  console.log('🧪 Testing Facebook SDK...')
  console.log('window.FB:', typeof window.FB)
  console.log('FB object:', window.FB)
  
  if (window.FB) {
    console.log('✅ Calling FB.XFBML.parse()...')
    window.FB.XFBML.parse()
  } else {
    console.log('❌ Facebook SDK not loaded')
  }
}

const refreshWidgets = () => {
  console.log('🔄 Refreshing all social widgets...')
  
  // Refresh Facebook widgets
  if (window.FB) {
    window.FB.XFBML.parse()
    console.log('✅ Facebook widgets refreshed')
  } else {
    initFacebookSDK()
  }
  
  // Refresh Twitter widgets
  if (window.twttr) {
    window.twttr.widgets.load()
    console.log('✅ Twitter widgets refreshed')
  } else {
    loadTwitterSDK()
  }
  
  // Refresh YouTube widgets
  if (window.gapi) {
    window.gapi.load('platform')
    console.log('✅ YouTube widgets refreshed')
  } else {
    loadYouTubeSDK()
  }
  
  console.log('✅ All widgets refresh completed!')
}

// Simulate periodic notifications
const simulateNotifications = () => {
  setInterval(() => {
    if (!showChat.value && Math.random() > 0.9) {
      hasUnreadMessages.value = true
    }
  }, 30000) // Every 30 seconds, 10% chance
}

onMounted(() => {
  simulateNotifications()
})

// Global click handler to close widgets
const handleGlobalClick = (e: Event) => {
  const target = e.target as Element
  if (!target.closest('.external-widgets')) {
    showChat.value = false
    showSocial.value = false
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
.external-widgets {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

/* Toggle Buttons */
.widget-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(196, 172, 125, 0.9), rgba(196, 172, 125, 0.8));
  border: 1px solid rgba(196, 172, 125, 0.6);
  border-radius: 25px;
  color: var(--bg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(196, 172, 125, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  min-width: 80px;
}

.widget-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.widget-toggle:hover::before {
  left: 100%;
}

.widget-toggle:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(196, 172, 125, 0.4);
}

.widget-toggle.active {
  background: linear-gradient(135deg, #d4c190, var(--gold));
  transform: translateY(-1px);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.toggle-text {
  font-size: 14px;
  white-space: nowrap;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ff4444;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Chat Widget */
.chat-widget {
  width: 350px;
  height: 500px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(196, 172, 125, 0.1);
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gold);
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-status 2s ease-in-out infinite;
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.close-chat {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-chat:hover {
  color: var(--gold);
  background: rgba(196, 172, 125, 0.1);
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(196, 172, 125, 0.1);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 2px;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: rgba(196, 172, 125, 0.1);
  padding: 8px 12px;
  border-radius: 12px;
  color: var(--parchment);
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-text {
  background: var(--gold);
  color: var(--bg);
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
  color: #9ca3af;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px;
  background: rgba(196, 172, 125, 0.1);
  border-radius: 12px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
  animation: typing-dot 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid rgba(196, 172, 125, 0.2);
  background: rgba(196, 172, 125, 0.05);
}

.chat-input input {
  flex: 1;
  padding: 10px 12px;
  background: rgba(11, 11, 11, 0.8);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  color: var(--parchment);
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px rgba(196, 172, 125, 0.2);
}

.chat-input input::placeholder {
  color: rgba(242, 233, 218, 0.5);
}

.chat-input button {
  padding: 10px;
  background: var(--gold);
  border: none;
  border-radius: 50%;
  color: var(--bg);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input button:hover:not(:disabled) {
  background: #d4c190;
  transform: scale(1.05);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Social Widget */
.social-widget {
  width: 320px;
  max-height: 80vh;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 1px solid rgba(196, 172, 125, 0.3);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  overflow: hidden;
}

.social-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(196, 172, 125, 0.1);
  border-bottom: 1px solid rgba(196, 172, 125, 0.2);
}

.social-header h3 {
  color: var(--gold);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.social-header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-widgets {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.refresh-widgets:hover {
  color: var(--gold);
  background: rgba(196, 172, 125, 0.1);
  transform: rotate(180deg);
}

.close-social {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-social:hover {
  color: var(--gold);
  background: rgba(196, 172, 125, 0.1);
}

.social-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.social-content::-webkit-scrollbar {
  width: 4px;
}

.social-content::-webkit-scrollbar-track {
  background: rgba(196, 172, 125, 0.1);
}

.social-content::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 2px;
}

.social-section {
  margin-bottom: 24px;
}

.social-section h4 {
  color: var(--gold);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.facebook-widgets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.discord-widget {
  background: rgba(88, 101, 242, 0.1);
  border: 1px solid rgba(88, 101, 242, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discord-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.discord-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.discord-text {
  display: flex;
  flex-direction: column;
}

.discord-title {
  color: #5865f2;
  font-weight: 600;
  font-size: 14px;
}

.discord-members {
  color: #9ca3af;
  font-size: 12px;
}

.discord-join {
  background: #5865f2;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.discord-join:hover {
  background: #4752c4;
  transform: translateY(-1px);
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(196, 172, 125, 0.05);
  border: 1px solid rgba(196, 172, 125, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: var(--parchment);
  transition: all 0.3s ease;
}

.quick-link:hover {
  background: rgba(196, 172, 125, 0.1);
  border-color: rgba(196, 172, 125, 0.3);
  transform: translateY(-1px);
}

.quick-link.twitter:hover {
  border-color: #1da1f2;
  box-shadow: 0 0 0 1px rgba(29, 161, 242, 0.2);
}

.quick-link.reddit:hover {
  border-color: #ff4500;
  box-shadow: 0 0 0 1px rgba(255, 69, 0, 0.2);
}

.quick-link.youtube:hover {
  border-color: #ff0000;
  box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.2);
}

.link-icon {
  font-size: 18px;
}

/* Facebook Share Buttons */
.facebook-share-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.fb-share-button, .fb-send-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1877F2;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.fb-share-button:hover, .fb-send-button:hover {
  background: #166fe5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(24, 119, 242, 0.3);
}

.fb-send-button {
  background: #0084ff;
}

.fb-send-button:hover {
  background: #0073e6;
}

.fb-debug {
  padding: 8px;
  background: rgba(196, 172, 125, 0.1);
  border-radius: 6px;
  font-family: monospace;
}

/* Facebook Widgets */
.facebook-comments-wrapper,
.facebook-page-wrapper,
.facebook-post-wrapper {
  margin-bottom: 16px;
}

.facebook-comments-wrapper h5,
.facebook-page-wrapper h5,
.facebook-post-wrapper h5 {
  color: var(--gold);
  font-size: 13px;
  margin: 12px 0 8px 0;
  font-weight: 600;
}

/* Messenger Widget */
.messenger-widget {
  background: rgba(0, 132, 255, 0.1);
  border: 1px solid rgba(0, 132, 255, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.messenger-note {
  margin-top: 8px;
  text-align: center;
}

/* Twitter Widget */
.twitter-widget {
  background: rgba(29, 161, 242, 0.1);
  border: 1px solid rgba(29, 161, 242, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

/* YouTube Widget */
.youtube-widget {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.youtube-latest-video iframe {
  border-radius: 8px;
}

/* Updated Quick Links */
.quick-link.twitch:hover {
  border-color: #9146ff;
  box-shadow: 0 0 0 1px rgba(145, 70, 255, 0.2);
}

.quick-link.email:hover {
  border-color: #34d399;
  box-shadow: 0 0 0 1px rgba(52, 211, 153, 0.2);
}

/* Animations */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .external-widgets {
    bottom: 80px;
    right: 10px;
  }
  
  .chat-widget, .social-widget {
    width: calc(100vw - 20px);
    max-width: 350px;
  }
  
  .chat-widget {
    height: 400px;
  }
  
  .social-widget {
    max-height: 400px;
  }
}
</style>