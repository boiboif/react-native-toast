import { defineConfig, type DefaultTheme } from 'vitepress';

const repository = 'https://github.com/boiboif/react-native-toast';

const sharedTheme: Pick<DefaultTheme.Config, 'search' | 'socialLinks'> = {
  search: { provider: 'local' },
  socialLinks: [{ icon: 'github', link: repository }],
};

const zhTheme: DefaultTheme.Config = {
  ...sharedTheme,
  nav: [
    { text: '指南', link: '/guide/getting-started' },
    { text: 'API', link: '/api/' },
    { text: 'Expo', link: '/guide/expo' },
    {
      text: 'npm',
      link: 'https://www.npmjs.com/package/@boiboif/react-native-toast',
    },
  ],
  sidebar: [
    {
      text: '开始使用',
      items: [
        { text: '介绍', link: '/' },
        { text: '安装', link: '/guide/getting-started' },
        { text: '使用与配置', link: '/guide/usage' },
      ],
    },
    {
      text: '集成',
      items: [
        { text: 'Expo 项目', link: '/guide/expo' },
        { text: '问题排查', link: '/guide/troubleshooting' },
      ],
    },
    {
      text: '参考',
      items: [{ text: 'API', link: '/api/' }],
    },
  ],
  editLink: {
    pattern: `${repository}/edit/main/docs/:path`,
    text: '在 GitHub 上编辑此页',
  },
  outline: { label: '页面导航', level: [2, 3] },
  docFooter: { prev: '上一页', next: '下一页' },
  lastUpdated: { text: '最后更新于' },
  returnToTopLabel: '返回顶部',
  sidebarMenuLabel: '菜单',
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换到浅色模式',
  darkModeSwitchTitle: '切换到深色模式',
  footer: {
    message: '基于 MIT 许可证发布',
    copyright: 'Copyright © 2026 boiboif',
  },
};

const enTheme: DefaultTheme.Config = {
  ...sharedTheme,
  nav: [
    { text: 'Guide', link: '/en/guide/getting-started' },
    { text: 'API', link: '/en/api/' },
    { text: 'Expo', link: '/en/guide/expo' },
    {
      text: 'npm',
      link: 'https://www.npmjs.com/package/@boiboif/react-native-toast',
    },
  ],
  sidebar: [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/en/' },
        { text: 'Installation', link: '/en/guide/getting-started' },
        { text: 'Usage and configuration', link: '/en/guide/usage' },
      ],
    },
    {
      text: 'Integration',
      items: [
        { text: 'Expo projects', link: '/en/guide/expo' },
        { text: 'Troubleshooting', link: '/en/guide/troubleshooting' },
      ],
    },
    {
      text: 'Reference',
      items: [{ text: 'API', link: '/en/api/' }],
    },
  ],
  editLink: {
    pattern: `${repository}/edit/main/docs/:path`,
    text: 'Edit this page on GitHub',
  },
  outline: { label: 'On this page', level: [2, 3] },
  docFooter: { prev: 'Previous page', next: 'Next page' },
  lastUpdated: { text: 'Last updated' },
  footer: {
    message: 'Released under the MIT License',
    copyright: 'Copyright © 2026 boiboif',
  },
};

export default defineConfig({
  title: '@boiboif/react-native-toast',
  description: 'Native Toast for the React Native New Architecture',
  base: process.env.DOCS_BASE ?? '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://boiboif.github.io/react-native-toast/' },
  head: [
    ['meta', { name: 'theme-color', content: '#16866f' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '@boiboif/react-native-toast' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Native Toast for React Native bare and Expo development builds',
      },
    ],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '@boiboif/react-native-toast',
      description: '面向 React Native 新架构的原生 Toast',
      themeConfig: zhTheme,
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: '@boiboif/react-native-toast',
      description: 'Native Toast for the React Native New Architecture',
      themeConfig: enTheme,
    },
  },
});
