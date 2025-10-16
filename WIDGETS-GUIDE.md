# 🔧 External Widgets - Live Chat & Social Media

## ✨ Tính năng đã thêm

### 1. **Live Chat Widget**
- 💬 Real-time chat support
- 🤖 Auto-response với AI-style replies
- 📱 Responsive design
- 🔔 Notification indicators
- ⌨️ Typing indicators
- 📜 Message history

### 2. **Facebook Integration**
- 👍 Facebook Like Button
- 📤 Facebook Share Button  
- 📘 Facebook Page Plugin (mini)
- 🔗 Auto-sync với current URL

### 3. **Discord Widget**
- 🎮 Server info display
- 👥 Member count (simulated)
- 🚀 Direct join link
- 🎨 Discord branding

### 4. **Quick Social Links**
- 🐦 Twitter
- 📱 Reddit  
- 📺 YouTube
- 🔗 External links

## 🎯 Vị trí và UX

### **Fixed Position (Bottom Right)**
```css
position: fixed;
bottom: 20px;
right: 20px;
z-index: 9999;
```

### **Toggle Buttons**
- **Chat Toggle**: Hiện/ẩn live chat
- **Social Toggle**: Hiện/ẩn social widgets
- **Auto-close**: Click outside để đóng
- **Notification dots**: Báo tin nhắn mới

### **Responsive Design**
- **Desktop**: Full size widgets
- **Mobile**: Compact version, bottom placement
- **Auto-adjust**: Width adapts to screen

## 🔧 Tính năng Chat

### **Auto Responses**
```typescript
// Keyword-based responses
if (userText.includes('bug')) {
  botResponse = 'I understand you\'re experiencing a bug...'
} else if (userText.includes('account')) {
  botResponse = 'For account-related issues...'
}
```

### **Chat Features**
- ✅ Real-time messaging UI
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Scroll to bottom auto
- ✅ Notification system
- ✅ Enter to send

## 📘 Facebook Integration

### **SDK Loading**
```javascript
// Auto-loads Facebook SDK
script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0'
```

### **Like/Share Widget**
```html
<div class="fb-like" 
     data-href="currentUrl" 
     data-layout="standard" 
     data-action="like" 
     data-share="true">
</div>
```

### **Page Plugin**
```html
<div class="fb-page" 
     data-href="https://www.facebook.com/wutheringwaves" 
     data-width="300" 
     data-height="130">
</div>
```

## 🎮 Discord Integration

### **Server Widget**
- **Visual**: Discord branding với logo
- **Info**: Server name và member count
- **Action**: Direct join link
- **Style**: Discord theme colors

### **Member Count Simulation**
```typescript
// Simulated online members
discord-members: "1,234 members online"
```

## 🎨 Visual Design

### **Theme Integration**
- **Colors**: Matches game's gold/parchment theme
- **Backdrop**: Blur effects và transparency
- **Animations**: Smooth slide-up transitions
- **Shadows**: Layered box-shadows

### **Interactive Effects**
- **Hover**: Scale và glow effects
- **Active**: State indicators
- **Transitions**: Cubic-bezier easing
- **Loading**: Typing animations

## 🔒 Security & CSP

### **Content Security Policy Updates**
```html
script-src: + https://connect.facebook.net
connect-src: + https://www.facebook.com https://connect.facebook.net
```

### **Type Safety**
```typescript
// Global Facebook SDK types
declare global {
  interface Window {
    FB?: { XFBML: { parse: () => void } }
  }
}
```

## 📱 Mobile Optimizations

### **Responsive Breakpoints**
```css
@media (max-width: 768px) {
  .external-widgets {
    bottom: 80px; /* Above nav */
    right: 10px;
  }
  
  .chat-widget {
    width: calc(100vw - 20px);
    height: 400px;
  }
}
```

## 🚀 Usage

### **Automatic**
- Widgets tự động load khi vào trang
- Facebook SDK auto-initialize
- Chat notifications simulate theo thời gian

### **User Interaction**
1. **Chat**: Click chat button → Type message → Auto response
2. **Facebook**: Click social → Like/Share buttons available
3. **Discord**: Click Discord widget → Direct to server
4. **Links**: Quick access to social platforms

## 🛠️ Customization

### **Chat Responses**
Thêm responses trong `sendMessage()`:
```typescript
if (userText.includes('your-keyword')) {
  botResponse = 'Your custom response'
}
```

### **Social Links**
Update URLs trong quick-links:
```html
<a href="https://your-social-link" target="_blank">
```

### **Discord Server**
Thay đổi Discord server link:
```html
<a href="https://discord.gg/your-server">
```

Widgets này sẽ tăng engagement và tạo community connection! 🎉