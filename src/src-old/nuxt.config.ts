import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  debug: true,

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/devtools',
    '@tailwindcss/postcss',
    '@nuxtjs/supabase'
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      tailwindcss(),
    ],
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    // redirect: false // Disable built-in redirect for custom auth flow
  }
})