import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        jobs: "jobs.html",
        details: "job-details.html",
        saved: "saved.html"
      }
    }
  }
});