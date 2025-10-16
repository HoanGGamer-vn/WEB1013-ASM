import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        // GitHub Pages base path (change this if using different repo name)
        base: mode === 'production' ? '/WEB1013-ASM/' : '/',
        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        // Performance optimization
        build: {
            // Code splitting
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Vendor chunk
                        vendor: ['vue', 'vue-router'],
                        // UI components chunk  
                        ui: [
                            '@/components/common/Header.vue',
                            '@/components/common/Footer.vue',
                            '@/components/common/LoadingSpinner.vue'
                        ]
                    }
                }
            },
            // Minification
            minify: 'esbuild',
            // Source maps for debugging
            sourcemap: false,
            // Asset optimization
            assetsInlineLimit: 4096, // 4kb
            cssCodeSplit: true
        },
        // Development server optimization
        server: {
            cors: true,
            hmr: {
                overlay: false
            },
            // Configure headers for media files
            headers: {
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin',
                // Disable caching in development
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            // Configure MIME types for video files
            fs: {
                strict: false
            }
        },
        // CSS preprocessing
        css: {
            devSourcemap: true,
            preprocessorOptions: {
                scss: {
                    additionalData: "@import \"@/assets/variables.scss\";"
                }
            }
        },
        // Asset handling
        assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.fbx', '**/*.mp4', '**/*.webm', '**/*.ogg'],
        // Environment variables
        envPrefix: ['VITE_'],
        // Production optimizations
        define: {
            __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
            __BUILD_TIME__: JSON.stringify(new Date().toISOString())
        }
    };
});
