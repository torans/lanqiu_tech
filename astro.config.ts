import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import unocss from 'unocss/astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'

import { remarkPlugins, rehypePlugins } from './plugins'
import { SITE } from './src/config'

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE.website,
  base: SITE.base,
  integrations: [
    sitemap(),
    robotsTxt(),
    unocss({
      // https://unocss.dev/integrations/astro#style-reset
      injectReset: true,
    }),
    astroExpressiveCode(),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins,
    rehypePlugins,
  },
  vite: {
    build: { chunkSizeWarningLimit: 1200 },
  },
})
