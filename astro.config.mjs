// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  markdown: {
    // Shiki is Astro's built-in highlighter; theme pinned for reproducibility
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
