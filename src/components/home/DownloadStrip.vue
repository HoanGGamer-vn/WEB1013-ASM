<template>
  <div class="download-box">
    <!-- QR box -->
    <div class="qrcode">
      <img :src="baseUrl + 'images/qr.png'" alt="Scan to download" />
    </div>

    <!-- Grid 2 hàng × 3 cột -->
    <div class="btn-grid">
      <a class="dl" href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer" aria-label="Windows">
        <img :src="baseUrl + 'images/btn-windows.png'" alt="Windows" />
      </a>
      <a class="dl" href="https://play.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Google Play">
        <img :src="baseUrl + 'images/btn-googleplay.png'" alt="Google Play" />
      </a>
      <a class="dl" href="https://play.google.com/games/" target="_blank" rel="noopener noreferrer" aria-label="Google Play Games">
        <img :src="baseUrl + 'images/btn-googleplaygames.png'" alt="Google Play Games" />
      </a>

      <a class="dl" href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" aria-label="App Store">
        <img :src="baseUrl + 'images/btn-appstore.png'" alt="App Store" />
      </a>
      <a class="dl" href="https://store.epicgames.com/" target="_blank" rel="noopener noreferrer" aria-label="Epic Games">
        <img :src="baseUrl + 'images/btn-epic.png'" alt="Epic Games" />
      </a>
      <a class="dl" href="https://store.playstation.com/" target="_blank" rel="noopener noreferrer" aria-label="PS5">
        <img :src="baseUrl + 'images/btn-ps5.png'" alt="PlayStation 5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// Base URL for assets
const baseUrl = import.meta.env.BASE_URL
</script>

<style scoped>
.download-box{
  position:absolute; left:24px; bottom:108px;
  display:flex; gap:12px; align-items:flex-end;
  padding:10px; border-radius:12px;
  background:rgba(0,0,0,.35);
  border:1px solid rgba(196,172,125,.25);
  backdrop-filter: blur(6px);
  box-shadow:0 6px 16px rgba(0,0,0,.25);
  transform-origin:left bottom;
  transform: scale(clamp(.65,.75 + .3vw,.85));
  z-index:50;
}

/* QR chỉ chứa ảnh */
.qrcode img{
  display:block; width:110px; height:110px;
  background:#fff; padding:2px; border-radius:8px;
  object-fit:contain;
}

/* Lưới 2 hàng × 3 cột */
.btn-grid{
  display:grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(2, auto);
  gap: 5px;
  align-items:center;
  justify-items:center;
  
}

/* Ô nút + ảnh tự fit */
.dl{
  display:flex; align-items:center; justify-content:center;
  padding:6px 10px; border-radius:12px;
  border:0px solid rgba(255,255,255,.08);
  background:rgba(0,0,0,.28);
  box-shadow:0 6px 16px rgba(0,0,0,.18);
  transition: transform .15s, box-shadow .15s, border-color .15s;
}
.dl img{
  display:block;
  max-height:42px;  /* đồng đều chiều cao tối đa */
  width:auto; height:auto; object-fit:contain;
}
.dl:hover{
  transform:scale(1.03);
  border-color:rgba(196,172,125,.45);
  box-shadow:0 10px 26px rgba(0,0,0,.28);
}

@media (max-width: 560px){
  .btn-grid{ grid-template-columns: repeat(2, auto); }
}
</style>
