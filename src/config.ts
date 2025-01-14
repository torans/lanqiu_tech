import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://lanqiu.tech/',
  base: '/',
  title: '兰秋十六',
  description: '追光大叔的博客，记录了我的开发、学习、生活。',
  author: '兰秋十六',
  lang: ' cn',
  ogLocale: 'zh_CN',
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/',
      title: '首页',
      displayMode: 'alwaysText',
      text: ' Home/首页',
    },
    {
      path: '/blog',
      title: 'Blog',
      displayMode: 'alwaysText',
      text: 'Blog/博客',
    },

    // {
    //   path: '/projects',
    //   title: 'Projects',
    //   displayMode: 'alwaysText',
    //   text: 'Projects',
    // },
    {
      path: '/photographs',
      title: 'Photographs',
      displayMode: 'alwaysText',
      text: 'Photographs/摄影',
    },
    {
      path: '/calligraphy',
      title: 'Calligraphy/手写书法作品',
      displayMode: 'alwaysText',
      text: 'Calligraphy/手写',
    },
  ],
  socialLinks: [
    {
      link: 'https://github.com/torans',
      title: 'Jran on Github',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
    {
      link: 'https://x.com/jran41134074',
      title: 'Astro on Twitter',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-twitter-x-fill',
    },
  ],
  navBarLayout: {
    left: [],
    right: [
      'internalNavs',
      'socialLinks',
      'searchButton',
      'themeButton',
      'rssLink',
    ],
    mergeOnMobile: true,
  },
  tabbedLayoutTabs: [
    { title: 'Changelog', path: '/changelog' },
    { title: 'AstroBlog', path: '/feeds' },
    { title: 'AstroStreams', path: '/streams' },
  ],
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  githubView: {
    monorepos: [
      'withastro/astro',
      'withastro/starlight',
      'lin-stephanie/astro-loaders',
    ],
    mainLogoOverrides: [
      [/starlight/, 'https://starlight.astro.build/favicon.svg'],
    ],
    subLogoMatches: [
      [/theme/, 'i-unjs-theme-colors'],
      [/github/, 'https://www.svgrepo.com/show/475654/github-color.svg'],
      [/tweet/, 'i-logos-twitter'],
      [/bluesky/, 'i-logos-bluesky'],
    ],
  },
}

/**
 * Configures whether to enable special features:
 *  - Set to `false` or `[false, {...}]` to disable the feature.
 *  - Set to `[true, {...}]` to enable and configure the feature.
 */
export const FEATURES: Features = {
  share: [
    true,
    {
      twitter: [true, '@ste7lin'],
      bluesky: [true, '@ste7lin.bsky.social'],
      mastodon: false,
      facebook: false,
      pinterest: false,
      reddit: false,
      telegram: false,
      whatsapp: false,
      email: false,
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
      displayPosition: 'left',
      displayMode: 'hover',
    },
  ],
  ogImage: [
    true,
    {
      authorOrBrand: `${SITE.title}`,
      fallbackTitle: `${SITE.description}`,
      fallbackBgType: 'plum',
    },
  ],
  slideEnterAnim: [true, { enterStep: 60 }],
}
