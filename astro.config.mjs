// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkHideObsidianRelatedLinks from './src/utils/remark-hide-obsidian-related-links.mjs';

export default defineConfig({
  site: 'https://blog.whqtker.com',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkHideObsidianRelatedLinks],
    // Shiki is Astro's built-in highlighter; theme pinned for reproducibility
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
