# 🎯 Hướng Dẫn Thiết Kế Layout - Định Vị Trí Chính Xác

## 📋 Mục Lục
1. [Hệ Thống Grid](#hệ-thống-grid)
2. [Zones Cơ Bản](#zones-cơ-bản)
3. [Characters View Layout](#characters-view-layout)
4. [Responsive Design](#responsive-design)
5. [CSS Classes](#css-classes)
6. [Tips & Tricks](#tips--tricks)

---

## 🎨 Hệ Thống Grid

### Grid 50x50px
```css
.design-container {
    background-image: 
        linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
}
```

**Lợi ích:**
- ✅ Dễ dàng căn chỉnh elements
- ✅ Spacing nhất quán 
- ✅ Visual guide khi thiết kế
- ✅ Responsive breakpoints rõ ràng

---

## 🏗️ Zones Cơ Bản

### 1. Header Zone (🔴 Đỏ)
```
Vị trí: Top: 0, Left: 0, Right: 0, Height: 80px
Mục đích: Navigation, Logo, User Controls
Z-index: 50 (cao nhất)
```

### 2. Main Content Zone (🔵 Xanh Dương)
```
Vị trí: Top: 80px, Left: 250px, Right: 250px, Bottom: 60px
Mục đích: Nội dung chính
Responsive: Full width trên mobile
```

### 3. Left Sidebar (🟢 Xanh Lá)
```
Vị trí: Top: 80px, Left: 0, Width: 250px, Bottom: 60px
Mục đích: Menu, Filters, Categories
Mobile: Ẩn hoặc overlay menu
```

### 4. Right Sidebar (🟣 Tím)
```
Vị trí: Top: 80px, Right: 0, Width: 250px, Bottom: 60px
Mục đích: Ads, Related content, Widgets
Mobile: Ẩn hoặc chuyển xuống dưới
```

### 5. Footer Zone (🟡 Vàng)
```
Vị trí: Bottom: 0, Left: 0, Right: 0, Height: 60px
Mục đích: Links, Copyright, Contact
Z-index: 40
```

---

## 🎮 Characters View Layout

### Faction Area (🔴 Red Zone)
```css
.faction-area {
    grid-area: faction;
    /* Vị trí: Top-Left */
    /* Size: 300x250px */
    /* Mục đích: Hiển thị faction được chọn */
}
```

**Nội dung:**
- Icon faction lớn
- Tên faction
- Mô tả ngắn
- Crosshair effect

### Characters Navigation (🔵 Blue Zone)
```css
.character-nav-area {
    grid-area: characters;
    /* Vị trí: Top-Center & Top-Right */
    /* Size: Dynamic width x 200px */
    /* Mục đích: Chọn character (tối đa 3) */
}
```

**Nội dung:**
- Navigation arrows (nếu > 3 characters)
- Character cards với hover effects
- Element badges
- Active character highlight

### Lore Area (🟡 Yellow Zone)
```css
.lore-area {
    grid-area: lore;
    /* Vị trí: Middle-Right */
    /* Size: Dynamic width x 200px */
    /* Mục đích: Hiển thị story character */
}
```

**Nội dung:**
- Character name & title
- Background story
- Character quotes
- Scrollable content

### Skills Area (🟢 Green Zone)
```css
.skills-area {
    grid-area: skills;
    /* Vị trí: Bottom - Full Width */
    /* Size: Full width x 150px */
    /* Mục đích: Demo skills character */
}
```

**Nội dung:**
- Skill demonstrations
- Interactive elements
- Animation preview
- Skill descriptions

---

## 📱 Responsive Design

### Mobile (< 768px)
```css
@media (max-width: 768px) {
    .character-layout {
        grid-template-areas:
            "faction"
            "characters" 
            "lore"
            "skills";
        grid-template-columns: 1fr;
        padding: 15px;
    }
}
```

### Tablet (768px - 1024px)
```css
@media (min-width: 768px) and (max-width: 1024px) {
    .character-layout {
        grid-template-areas: 
            "faction characters"
            "lore lore"
            "skills skills";
        grid-template-columns: 300px 1fr;
    }
}
```

### Desktop (> 1024px)
```css
@media (min-width: 1024px) {
    .character-layout {
        grid-template-areas: 
            "faction characters characters"
            "lore lore lore"
            "skills skills skills";
        grid-template-columns: 300px 1fr;
    }
}
```

---

## 🎨 CSS Classes Quan Trọng

### Layout Classes
```css
.layout-container { /* Container chính */ }
.zone { /* Base class cho tất cả zones */ }
.zone-header { /* Header specific */ }
.zone-main { /* Main content specific */ }
.zone-sidebar-left { /* Left sidebar specific */ }
.zone-sidebar-right { /* Right sidebar specific */ }
.zone-footer { /* Footer specific */ }
```

### Character Layout Classes
```css
.character-layout { /* Grid container */ }
.faction-area { /* Red zone */ }
.character-nav-area { /* Blue zone */ }
.lore-area { /* Yellow zone */ }
.skills-area { /* Green zone */ }
```

### State Classes
```css
.active { /* Active element */ }
.hidden { /* Hidden element */ }
.loading { /* Loading state */ }
.error { /* Error state */ }
```

---

## 💡 Tips & Tricks

### 1. Sử Dụng CSS Grid
```css
/* Thay vì position absolute phức tạp */
.layout {
    display: grid;
    grid-template-areas: "sidebar main";
    grid-template-columns: 250px 1fr;
}
```

### 2. Z-Index Hierarchy
```
Header: 50
Modals: 100
Tooltips: 200
Overlays: 999
```

### 3. Spacing System
```css
/* Sử dụng spacing nhất quán */
--spacing-xs: 5px;
--spacing-sm: 10px;
--spacing-md: 20px;
--spacing-lg: 40px;
--spacing-xl: 80px;
```

### 4. Breakpoints
```css
/* Mobile First Approach */
.element {
    /* Mobile styles */
}

@media (min-width: 768px) {
    /* Tablet styles */
}

@media (min-width: 1024px) {
    /* Desktop styles */
}
```

### 5. Performance Tips
- Sử dụng `transform` thay vì `top/left` cho animations
- Dùng `will-change` cho elements sẽ animate
- Optimize z-index layers
- Sử dụng CSS containment khi có thể

---

## 🔧 Cách Sử Dụng Design Guide

1. **Mở file `design-guide.html`** trong browser
2. **Sử dụng Control Panel** để switch giữa các view
3. **Click vào zones** để xem thông tin chi tiết
4. **Toggle grid/measurements** để điều chỉnh
5. **Export CSS** khi đã thiết kế xong
6. **Copy coordinates** để sử dụng trong code

---

## 🎯 Kết Luận

Hệ thống này giúp bạn:
- ✅ **Visualize** layout trước khi code
- ✅ **Standardize** vị trí và kích thước
- ✅ **Responsive** design dễ dàng
- ✅ **Collaborate** hiệu quả với team
- ✅ **Maintain** code sạch và organized

**Happy Designing! 🎨✨**