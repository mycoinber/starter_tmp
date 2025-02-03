// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from "fs";
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  css: ["~/assets/scss/main.scss"],
  modules: [
    "@nuxt/content",
    "@nuxt/image-edge",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
  ],
  app: {
    head: (() => {
      // Проверяем, находимся ли мы на клиенте

      const rawContent = JSON.parse(
        readFileSync(resolve("site.json"), "utf-8")
      );

      // Преобразуем строки с тегами в массивы объектов для head
      return {
        link: rawContent
          .filter((tag: string) => tag.startsWith("<link"))
          .map((tag: string) => {
            // Используем регулярные выражения для парсинга атрибутов
            const attributes = Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g));
            return Object.fromEntries(
              attributes.map(([_, name, value]) => [name, value])
            );
          }),
        meta: rawContent
          .filter((tag: string) => tag.startsWith("<meta"))
          .map((tag: string) => {
            // Используем регулярные выражения для парсинга атрибутов
            const attributes = Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g));
            return Object.fromEntries(
              attributes.map(([_, name, value]) => [name, value])
            );
          }),
      };
    })(),
  },
  nitro: {
    node: true,
    prerender: {
      ignore: ["/yandex-browser-manifest.json"],
    },
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
      backHost: process.env.BACK_HOST,
    },
    server: {
      siteId: process.env.SITE_ID,
      backHost: process.env.BACK_HOST_SV,
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
  googleFonts: {
    families: {
      Roboto: [400, 700],
      Inter: [400, 700], 
    },
    display: "swap",
  },
  compatibilityDate: "2024-11-26",
});
