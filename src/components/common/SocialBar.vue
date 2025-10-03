<template>
  <div class="social">
    <a aria-label="X"        href="https://twitter.com/" target="_blank" rel="noopener noreferrer"></a>
    <a aria-label="Facebook" href="https://facebook.com/" target="_blank" rel="noopener noreferrer"></a>
    <a aria-label="Discord"  href="https://discord.gg/" target="_blank" rel="noopener noreferrer"></a>
    <a aria-label="YouTube"  href="https://youtube.com/" target="_blank" rel="noopener noreferrer"></a>
    <a aria-label="Reddit"   href="https://reddit.com/r/" target="_blank" rel="noopener noreferrer"></a>
    <a aria-label="TikTok"   href="https://tiktok.com/" target="_blank" rel="noopener noreferrer"></a>
  </div>
</template>
<style scoped>
.social{position:absolute;left:32px;bottom:70px;display:flex;gap:18px;z-index:50}
.social a{
  width:22px;
  height:22px;
  opacity:.85;
  background-size:contain;
  background-repeat:no-repeat;
  transition:all 0.3s ease;
  cursor:pointer;
}

.social a[aria-label="X"]        {background-image:url('/images/social-x.png')}
.social a[aria-label="Facebook"] {background-image:url('/images/social-facebook.png')}
.social a[aria-label="Discord"]  {background-image:url('/images/social-discord.png')}
.social a[aria-label="YouTube"]  {background-image:url('/images/social-youtube.png')}
.social a[aria-label="Reddit"]   {background-image:url('/images/social-reddit.png')}
.social a[aria-label="TikTok"]   {background-image:url('/images/social-tiktok.png')}

.social a:hover{
  opacity:1;
  transform:scale(1.2);
  filter:brightness(1.2);
}
</style>
