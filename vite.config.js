import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import {join} from 'path';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: '5177',
        proxy: {
            '/api': {
                target: 'xxx',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
    },
    plugins: [
        vue(),
        // 增加下面的配置项,这样在运行时就能检查eslint规范
        eslintPlugin({
            include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
        }),
        inject({
            'window.Quill': ['@vueup/vue-quill', 'Quill'],
            Quill: ['@vueup/vue-quill', 'Quill']
        })
    ],
    //配置src目录别名
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
            '@assets': join(__dirname, 'src/assets'),
            '@style': join(__dirname, 'src/style'),
            '@components': join(__dirname, 'src/components'),
            '@pages': join(__dirname, 'src/pages'),
            '@api': join(__dirname, 'src/api'),
            '@util': join(__dirname, 'src/util'),
        }
    }
});
