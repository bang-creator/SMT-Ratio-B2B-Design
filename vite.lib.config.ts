import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    outDir: 'dist-package',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'OpenAIPlatformDesignSystem',
      fileName: 'openai-platform-design-system',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
