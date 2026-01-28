import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // THIS LINE BELOW TELLS GITHUB WHERE YOUR APP LIVES
  base: '/mandastrong-studio-2025/', 
  build: {
    outDir: 'dist',
  },
});