import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  // https://devtools.nuxt.com
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()]
  },
  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
      },
      appwrite: {
        endpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
        projectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID
      }
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},
  ssr: false,
  pwa: {
    client: {
      installPrompt: true,
    },
    filename: 'sworker.js',
    registerType: 'prompt',
    devOptions: {
      enabled: false,
    },
    manifest: {
      name: 'My Tiny Café',
      short_name: 'Tiny Café',
      description: 'Order your favorite café',
      theme_color: '#f0e4d2',
      start_url: '/pwa',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }
  },
  // --- CONFIGURATION DE SERVEUR ---
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['login', 'pwa'],
    },
  },
  app: {
    head: {
      title: 'My Tiny Café',
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'description', content: `Order your favorite café` },
        { name: 'theme-color', content: '#f0e4d2' }
      ],
      link: [
          { rel: 'icon', href: '/favicon.ico' },
          { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png', sizes: '180x180' },
          { rel: 'mask-icon', href: '/pwa-512x512.png', color: '#f0e4d2' }
      ]
    }
  }
})