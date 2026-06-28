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
        hostname: 'admin.theater-kleinraming.at',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
      },
    ],
  },

  integrations: [sitemap()],
});
