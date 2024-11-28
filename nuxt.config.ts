// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  css: ["~/assets/scss/main.scss"],
  modules: [
    "@nuxt/content",
    "@nuxt/image-edge",
    "nuxt-icon",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
  ],

  nitro: {
    node: true,
  },
  vite: {
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ["../pbn/*", "./"],
      },
      watch: {
        usePolling: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/assets/scss/variables/_variables.scss" as *; ' +
            '@use "~/assets/scss/variables/_breakpoints.scss" as *;',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      siteId: process.env.SITE_ID,
      backHost: process.env.BACK_HOST || "http://localhost:3077",
    },
    server: {
      siteId: process.env.SITE_ID,
      backHost: process.env.BACK_HOST_SV || "http://localhost:3077",
    },
  },
  plugins: ["~/plugins/vue-query.ts"],
  image: {
    provider: "ipx",
    dir: "public",
    domains: ["localhost:3077"],
    alias: {
      unsplash: "http://localhost:3077",
    },
  },
  compatibilityDate: "2024-11-26",
});
