// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  runtimeConfig: { public: { googleClientId: '' } },
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/toastify-js',
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.1.0/dist/confetti.min.js',
          defer: true
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})