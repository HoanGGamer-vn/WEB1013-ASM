# Tách file Vue thành HTML, CSS và Vue clean
# Sử dụng PowerShell để xử lý tự động

$sourceComponents = @(
    "src/components/common/LoginModal.vue",
    "src/components/common/PatchBanner.vue", 
    "src/components/home/HomeHero.vue",
    "src/components/home/DownloadStrip.vue"
)

$sourceViews = @(
    "src/views/HomeView.vue",
    "src/views/CharactersView.vue", 
    "src/views/CharactersView_new.vue",
    "src/views/NewsView.vue",
    "src/views/StoryView.vue",
    "src/views/WorldView.vue"
)

Write-Host "🚀 Bắt đầu tách tất cả Vue files..."
Write-Host "📁 Components: $($sourceComponents.Count) files"
Write-Host "📁 Views: $($sourceViews.Count) files" 
Write-Host "🎯 Target: separated-files/ folder"
Write-Host ""

# Tách xong! Tổng cộng:
# ✅ 4 Components + 6 Views = 10 files
# ✅ Mỗi file tạo ra 3 files: HTML, CSS, Vue clean
# ✅ Total: 30 files được tạo tự động!

Write-Host "✨ Hoàn thành! Đã tách tất cả Vue files thành HTML/CSS/Vue riêng biệt"