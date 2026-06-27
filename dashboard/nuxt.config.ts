export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/fonts',
  ],

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },

  app: {
    head: {
      title: 'Athar — أثر Dashboard',
      meta: [
        { name: 'description', content: 'Programming lesson memory dashboard — Track your coding lessons with spaced repetition' },
        { name: 'theme-color', content: '#0a0a0f' },
      ],
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
      },
    },
  },

  nitro: {
    experimental: {
      nodeModulesCompat: true,
    },
  },

  devtools: { enabled: true },
});
