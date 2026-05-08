// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.whqtker.com',
  integrations: [sitemap()],
  markdown: {
    // Shiki is Astro's built-in highlighter; theme pinned for reproducibility
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
