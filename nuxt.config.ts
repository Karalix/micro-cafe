import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui', '@vite-pwa/nuxt', '@nuxt/image', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  // https://i18n.nuxtjs.org — multilingual (en, fr, de, es, it, zh)
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
      { code: 'fr', name: 'Français', language: 'fr-FR', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', language: 'de-DE', file: 'de.json' },
      { code: 'es', name: 'Español', language: 'es-ES', file: 'es.json' },
      { code: 'it', name: 'Italiano', language: 'it-IT', file: 'it.json' },
      { code: 'zh', name: '中文', language: 'zh-CN', file: 'zh.json' },
    ],
    lazy: true,
    langDir: 'locales',
    vueI18n: './i18n.config.ts',
    bundle: {
      // Recommended by the module; avoids the deprecated translation-directive optimizer.
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },
  // https://devtools.nuxt.com
  devtools: { enabled: true },
  vite: {
    // `as any` works around duplicate vite type identities after adding @nuxtjs/i18n
    plugins: [tailwindcss() as any]
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
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY,
      appwrite: {
        endpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
        projectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID
      }
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

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
  nitro: {
    prerender: {
      routes: ['login', 'pwa'],
    },
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
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
      ],
      script: [
        {
          innerHTML: `var _paq=window._paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u="//analytics.kronikle.eu/matomo/";_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','1']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`
        }
      ]
    }
  }
})