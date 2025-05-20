import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://lanqiu.tech/',
  base: '/',
  title: '兰秋AI',
  description: '分享 AI 相关的新闻、智能体、AI自动化工作流等前沿内容。',
  author: '兰秋十六',
  lang: ' cn',
  ogLocale: 'zh_CN',
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/',
      title: 'Home/首页',
      displayMode: 'alwaysText',
      text: ' Home',
    },
    {
      path: '/news',
      title: 'AI News/AI新闻',
      displayMode: 'alwaysText',
      text: 'AI News',
    },
    {
      path: '/blog',
      title: 'Blog/博客',
      displayMode: 'alwaysText',
      text: 'Blog',
    },

    // {
    //   path: '/projects',
    //   title: 'Projects',
    //   displayMode: 'alwaysText',
    //   text: 'Projects',
    // },
    // {
    //   path: '/photographs',
    //   title: 'Photographs/摄影作品',
    //   displayMode: 'alwaysText',
    //   text: 'Photographs',
    // },
    // {
    //   path: '/calligraphy',
    //   title: 'Calligraphy/手写书法作品',
    //   displayMode: 'alwaysText',
    //   text: 'Calligraphy',
    // },
    {
      path: '/friends',
      title: 'Friends/友情链接',
      displayMode: 'alwaysText',
      text: 'Friends',
    },
    {
      path: '/about',
      title: 'About Me/关于我',
      displayMode: 'alwaysText',
      text: 'About Me',
    },
  ],
  socialLinks: [
    {
      link: 'https://github.com/torans',
      title: '兰秋十六 on Github',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
    {
      link: 'https://x.com/jran41134074',
      title: '兰秋十六 on Twitter',
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
    { title: '兰秋AI RSS', path: '/feeds' },
    { title: '兰秋AI', path: '/news' },
    { title: '兰秋博客', path: '/blog' },
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
      twitter: [true, '@jran41134074'],
      bluesky: [true, '@lanqiu-tech.bsky.social'],
      mastodon: false,
      facebook: false,
      pinterest: false,
      reddit: false,
      telegram: '@jan2023',
      whatsapp: false,
      email: 'jran@lanqiu.tech',
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
