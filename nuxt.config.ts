// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from "fs";
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  css: ["~/assets/scss/main.scss"],
  modules: [
    "@nuxt/image-edge",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "nuxt-schema-org",
    "nuxt-og-image",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],
  schemaOrg: {
    defaults: false,
  },
  site: { indexable: false },
  sitemap: {
    // exclude all app sources
    excludeAppSources: true,
  },
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
      crawlLinks: true,
      ignore: ["/yandex-browser-manifest.json"],
    },
  },
  vite: {
    css: {
      modules: {
        generateScopedName: `[local]-${process.env.SlUG}_[hash:base64:5]`,
      },
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/assets/scss/variables/_variables.scss" as *; ' +
            '@use "~/assets/scss/variables/_breakpoints.scss" as *;',
        },
      },
    },
    server: {
      fs: {
        allow: ["../pbn/*", "./"],
      },
      watch: {
        usePolling: true,
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
      unsplash: process.env.BACK_HOST || "http://localhost:3077",
    },
  },
  googleFonts: {
    families: {
      Oswald: [400, 500, 700],
      Inter: [400, 500, 700],
    },
    display: "swap",
  },
  compatibilityDate: "2024-11-26",
});
