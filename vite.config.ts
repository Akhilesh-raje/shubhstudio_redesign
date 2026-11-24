import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two pages: / = Shubh Studio sales site, /palace/ = the "Palace in Bloom" invitation demo.
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: { main: "index.html", palace: "palace/index.html" } } },
});
