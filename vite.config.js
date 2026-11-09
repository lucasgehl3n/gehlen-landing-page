import { resolve } from 'node:path';
export default { base: './', build: { outDir: 'dist', assetsInlineLimit: 0, rollupOptions: { input: { main: resolve(__dirname, 'index.html'), brand: resolve(__dirname, 'brand.html') } } } };
