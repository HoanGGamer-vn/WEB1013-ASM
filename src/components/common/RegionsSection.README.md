# RegionsSection Component

## Mô tả
Component Vue.js hiển thị carousel các vùng đất (regions) với thiết kế đẹp mắt và hiệu ứng chuyển tiếp mượt mà.

## Tính năng
- ✅ Tiêu đề "New Regions" với họa tiết trang trí hai bên
- ✅ Carousel 3 ảnh (ảnh chính lớn ở giữa, 2 ảnh phụ nhỏ hai bên)
- ✅ Ảnh chính sáng và rõ, ảnh phụ mờ và nhỏ hơn
- ✅ Tên vùng màu vàng (#C4AC7D) và mô tả bên dưới
- ✅ 2 nút điều hướng trái/phải
- ✅ Nền tối với font màu vàng nhạt
- ✅ Hiệu ứng chuyển ảnh mượt mà
- ✅ Hỗ trợ dữ liệu động qua props
- ✅ Responsive design
- ✅ Hover effects và animations

## Cách sử dụng

### Trong Vue.js
```vue
<template>
  <RegionsSection :regions="worldRegions" />
</template>

<script>
import RegionsSection from '@/components/common/RegionsSection.vue'

export default {
  components: {
    RegionsSection
  },
  data() {
    return {
      worldRegions: [
        {
          id: 1,
          name: 'Mystic Forest',
          description: 'A magical forest filled with ancient trees...',
          image: '/images/regions/mystic-forest.jpg'
        }
        // ... more regions
      ]
    }
  }
}
</script>
```

### Trong HTML thuần
```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/RegionsSection.css">

<!-- Include HTML structure -->
<section class="regions-section">
  <!-- Component content -->
</section>

<!-- Include JavaScript -->
<script src="path/to/RegionsSection.js"></script>
```

## Props (Vue version)

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| regions | Array | [] | Mảng các object region với id, name, description, image |

## Cấu trúc dữ liệu Region
```javascript
{
  id: Number,          // ID duy nhất
  name: String,        // Tên vùng đất
  description: String, // Mô tả ngắn
  image: String        // Đường dẫn ảnh
}
```

## Customization

### Màu sắc chính
- Primary color: `#C4AC7D` (vàng nhạt)
- Background: `#1a1a1a` to `#2d2d2d` (gradient tối)
- Text: `rgba(196, 172, 125, 0.8)`

### Kích thước
- Main image: 400x280px (desktop)
- Side images: 250x200px (desktop)
- Responsive breakpoints: 768px, 480px

## Files
- `src/components/common/RegionsSection.vue` - Vue component
- `separated-files/html/components/RegionsSection.html` - HTML version
- `separated-files/css/components/RegionsSection.css` - CSS styles
- `src/styles/components/regions-section.css` - Additional animations

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Demo
Component được sử dụng trong `WorldView.vue` với dữ liệu mẫu bao gồm:
- Mystic Forest
- Crystal Caverns  
- Floating Islands
- Volcanic Peaks
- Frozen Tundra