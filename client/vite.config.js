import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/auth': 'http://localhost:5000'||'https://web-steganography-6gmz.onrender.com/',
        '/steganography': 'http://localhost:5000'||"https://web-steganography-6gmz.onrender.com/",
      },
    },
  
})
