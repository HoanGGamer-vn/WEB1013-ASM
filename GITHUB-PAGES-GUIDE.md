# 🔵 HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

## 🚀 CÁCH SETUP NHANH NHẤT (5 PHÚT)

### **Bước 1: Enable GitHub Pages**
1. **Vào repository:** https://github.com/HoanGGamer-vn/WEB1013-ASM
2. **Click tab "Settings"** (góc phải)
3. **Scroll xuống tìm "Pages"** (menu trái)
4. **Source:** Chọn **"GitHub Actions"** 
5. **Click "Save"**

### **Bước 2: Workflow sẽ tự động chạy**
1. **Vào tab "Actions"** 
2. Sẽ thấy workflow **"Deploy to GitHub Pages"** đang chạy
3. Chờ 2-3 phút để build hoàn tất ✅

### **Bước 3: Truy cập website**
🎉 **Website sẽ live tại:**
```
https://HoanGGamer-vn.github.io/WEB1013-ASM/
```

---

## 🔧 NẾU CẦN SỬA LỖI

### Fix base path nếu website không load đúng:
Nếu CSS/JS không load, sửa file `vite.config.ts`:

```typescript
// Thay đổi base path
base: '/WEB1013-ASM/',
```

### Rebuild và push:
```bash
npm run build
git add .
git commit -m "Fix GitHub Pages base path"
git push
```

---

## ✨ TÍNH NĂNG GITHUB PAGES

### ✅ **Ưu điểm:**
- 🆓 **Hoàn toàn miễn phí**
- 🚀 **Auto-deploy** khi push code
- 🔒 **HTTPS** tự động
- 🌍 **CDN** toàn cầu
- 📊 **Không giới hạn** bandwidth
- ⚡ **Tốc độ cao**

### ⚠️ **Giới hạn:**
- 📁 Repository tối đa 1GB
- 🌐 Chỉ host static sites
- 👥 100GB bandwidth/tháng (rất nhiều)

---

## 🎯 SAU KHI LIVE

### **Test website:**
- ✅ Home page với video background
- ✅ Navigation: Characters, World, Story, News
- ✅ Chat widget (💬) với bot auto-reply
- ✅ Social widgets (📱) với Facebook, Twitter, etc.
- ✅ Responsive trên mobile

### **Share link:**
```
https://HoanGGamer-vn.github.io/WEB1013-ASM/
```

### **Update website:**
Để update nội dung, chỉ cần:
1. Sửa code
2. `git push`
3. GitHub tự động rebuild và deploy!

---

## 🎊 HOÀN THÀNH!

**Website Error404 - Wuthering Waves đã LIVE!**
- 🌐 **Public URL** cho mọi người truy cập
- 🚀 **Auto-deploy** khi có thay đổi  
- 🎮 **Full features** chat bot + social widgets
- 📱 **Mobile-friendly** responsive design

**Chia sẻ link với bạn bè ngay! 🎉**