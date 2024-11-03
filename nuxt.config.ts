// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
  modules: ["@nuxt/content", "@nuxt/image"],
  content: {
    documentDriven: true, // Включает режим documentDriven
  },
  image: {
    // IPX активируется по умолчанию
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      thumbnail: {
        modifiers: {
          format: "webp",
          width: 150,
          height: 150,
          quality: 80,
        },
      },
      large: {
        modifiers: {
          format: "jpeg",
          width: 1024,
          quality: 90,
        },
      },
    },
  },
  vite: {
    server: {
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
});
