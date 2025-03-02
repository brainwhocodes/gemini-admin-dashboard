// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      meta:  [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  css: [
    './node_modules/lite-youtube-embed/src/lite-yt-embed.css',
    '~/scss/theme.scss',
    '~/scss/bulma.scss'
  ]
})
