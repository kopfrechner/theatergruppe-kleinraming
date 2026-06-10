// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    assets: 'assets',
  },
  image: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cms.kopfarbeit.dev',
    }],
  },
});
