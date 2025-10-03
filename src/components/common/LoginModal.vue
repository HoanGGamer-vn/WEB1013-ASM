<template>
  <div v-if="showModal" class="login-overlay" @click="closeModal">
    <div class="login-modal" @click.stop>
      <div class="login-header">
        <h2>Sign In to ERROR404</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="login-body">
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="email">Email or Username</label>
            <input 
              type="text" 
              id="email" 
              v-model="loginForm.email" 
              placeholder="Enter your email or username"
              required
            />
          </div>
          
          <div class="input-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div class="login-options">
            <label class="checkbox">
              <input type="checkbox" v-model="loginForm.remember">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          
          <button type="submit" class="login-btn" :disabled="isLogging">
            {{ isLogging ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <div class="social-login">
          <button class="social-btn google" @click="loginWithGoogle">
            <span>🔵</span> Continue with Google
          </button>
          <button class="social-btn discord" @click="loginWithDiscord">
            <span>🟣</span> Continue with Discord
          </button>
        </div>
        
        <div class="signup-link">
          Don't have an account? <a href="#" @click="showSignup">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  showModal: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLogging = ref(false)
const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const closeModal = () => {
  emit('close')
}

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert('Please fill in all fields')
    return
  }
  
  isLogging.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Login attempt:', loginForm.value)
    alert('Login successful! (Demo)')
    closeModal()
    
    // Reset form
    loginForm.value = { email: '', password: '', remember: false }
  } catch (error) {
    console.error('Login error:', error)
    alert('Login failed. Please try again.')
  } finally {
    isLogging.value = false
  }
}

const loginWithGoogle = () => {
  alert('Google login coming soon!')
}

const loginWithDiscord = () => {
  alert('Discord login coming soon!')
}

const showSignup = () => {
  alert('Signup page coming soon!')
  closeModal()
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-modal {
  background: rgba(13,13,13,0.95);
  border: 1px solid color-mix(in oklab, var(--gold) 30%, transparent);
  border-radius: 16px;
  width: min(400px, 90vw);
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(12px);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid color-mix(in oklab, var(--gold) 20%, transparent);
}

.login-header h2 {
  margin: 0;
  color: var(--gold);
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--parchment);
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--gold);
}

.login-body {
  padding: 24px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--parchment);
  font-size: 14px;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0,0,0,0.5);
  border: 1px solid color-mix(in oklab, var(--gold) 20%, transparent);
  border-radius: 8px;
  color: var(--parchment);
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--gold) 20%, transparent);
}

.input-group input::placeholder {
  color: var(--muted);
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--parchment);
}

.forgot-link {
  color: var(--gold);
  font-size: 14px;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  background: var(--gold);
  color: #0b0b0b;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  background: color-mix(in oklab, var(--gold) 90%, white);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
  color: var(--muted);
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: color-mix(in oklab, var(--gold) 20%, transparent);
}

.divider span {
  background: rgba(13,13,13,0.95);
  padding: 0 16px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0,0,0,0.5);
  border: 1px solid color-mix(in oklab, var(--gold) 20%, transparent);
  border-radius: 8px;
  color: var(--parchment);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(255,255,255,0.05);
  border-color: var(--gold);
}

.signup-link {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

.signup-link a {
  color: var(--gold);
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>