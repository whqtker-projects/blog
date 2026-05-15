// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkObsidianImageWikilinks from './src/utils/remark-obsidian-image-wikilinks.mjs';

export default defineConfig({
  site: 'https://blog.whqtker.com',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkObsidianImageWikilinks],
    // Shiki is Astro's built-in highlighter; theme pinned for reproducibility
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
