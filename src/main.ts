import { createApp } from 'vue'
/// <reference types="vite/client" />
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(router).mount('#app')
