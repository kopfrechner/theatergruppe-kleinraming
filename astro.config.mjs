// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://theater-kleinraming.at',
  build: {
    assets: 'assets',
  },

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.kopfarbeit.dev',
      },
    ],
  },

  integrations: [sitemap()],
});
