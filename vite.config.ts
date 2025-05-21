import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // For tailwind
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
