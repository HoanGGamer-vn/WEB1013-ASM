# 🔄 Fix "Chỉ chạy offline" Issue

## 🐛 Vấn đề
Website chỉ hoạt động offline, không kết nối được với server trong development mode.

## 🔍 Nguyên nhân thường gặp

### 1. **Service Worker Cache Quá Mức**
- Service Worker cache tất cả resources
- Cache không được update khi code thay đổi
- PWA installer force offline mode

### 2. **Browser Cache Issues**
- Hard cache của browser
- DNS cache
- HTTP cache headers

### 3. **Network Configuration**
- Firewall blocks localhost
- Proxy/VPN issues
- Port conflicts

## 🛠️ Giải pháp đã áp dụng

### 1. **Service Worker Management**
```javascript
// ✅ Disabled service worker in development
if (import.meta.env.DEV) {
  console.log('[PWA] Service Worker disabled in development mode')
  return
}
```

### 2. **Auto Cache Clearing**
```javascript
// ✅ Auto clear caches in localhost
if (window.location.hostname === 'localhost') {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
```

### 3. **Development Headers**
```typescript
// ✅ No-cache headers trong dev mode
headers: {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache', 
  'Expires': '0'
}
```

### 4. **Network Status Monitor**
- ✅ Thêm NetworkStatus component
- ✅ Real-time network detection
- ✅ Retry button khi offline

## 🚀 Cách test

### Development Mode:
```bash
npm run dev
```
- Service Worker được disable
- Caches tự động clear
- Network status được monitor

### Production Test:
```bash
npm run build-only
npm run preview
```

### Manual Cache Clear:
1. **Browser DevTools:**
   - F12 → Application → Storage → Clear storage

2. **Console Command:**
   ```javascript
   clearAllCaches() // Function đã được add
   ```

3. **URL Parameter:**
   ```
   http://localhost:5173/?nocache=1
   ```

## 🔧 Troubleshooting

### Vẫn bị offline?

1. **Hard Refresh:**
   - `Ctrl + Shift + R`
   - `Cmd + Shift + R` (Mac)

2. **Clear Browser Data:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: History → Clear recent history

3. **Check Network:**
   - Disconnect/reconnect WiFi
   - Try different browser
   - Disable VPN/Proxy

4. **Reset Port:**
   ```bash
   npm run dev -- --port 3000
   ```

### Development Tips:

- ✅ Sử dụng Incognito/Private mode
- ✅ Disable cache trong DevTools (Network tab)
- ✅ Monitor console để xem cache clearing logs
- ✅ Check NetworkStatus component ở góc phải

## 📝 Files đã thay đổi

- `src/components/common/PWAInstaller.vue` - Disable SW in dev
- `index.html` - Auto cache clearing script
- `vite.config.ts` - No-cache headers
- `src/components/common/NetworkStatus.vue` - Network monitor
- `src/App.vue` - Add NetworkStatus component

Giờ website sẽ hoạt động bình thường trong development! 🎉