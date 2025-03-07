// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        'data-theme': 'cupcake'
      },
      meta:  [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  css: [
    '~/css/app.css',
  ]
})
