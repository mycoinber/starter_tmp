<template>
  <main>
    <Main :data="data" />
  </main>
</template>

<script setup>
  import { useNuxtApp } from "#app";
  import { useQuery } from "@tanstack/vue-query";

  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();
  const siteId = config.public.siteId;
  const route = useRoute();
  const slug = route.params.slug;

  const fetchPage = async (siteId, slug = null) => {
    const params = { siteId };

    // Добавляем slug только если он передан
    if (slug) {
      console.log(slug);
      params.slug = slug;
    }
    const response = await $axios.get("/pages/page-by-slug", {
      params,
    });
    return response.data;
  };

  const { data, isLoading, suspense } = useQuery({
    queryKey: computed(() => ["page", [slug, siteId]]),
    queryFn: () => fetchPage(siteId, slug),
    suspense: true,
  });

  onServerPrefetch(async () => {
    await suspense();
  });

  watchEffect(() => {
    if (data.value) {
      const pageHead = data.value.head;
      const og = pageHead.open_graph || {};
      const twitter = pageHead.twitter_card || {};
      const essential = pageHead.essential_links || {};

      useHead({
        title: pageHead.title || "",
        meta: [
          // Основные мета-теги
          { name: "description", content: pageHead.meta_description },
          { name: "keywords", content: pageHead.keywords },
          { name: "robots", content: pageHead.robots },
          { name: "viewport", content: pageHead.viewport },
          // Задаём charset (обычно в виде <meta charset="UTF-8">)
          { charset: pageHead.charset },

          // Canonical – обычно оформляется через link, но можно добавить и meta для совместимости
          // Open Graph
          { property: "og:title", content: og.title },
          { property: "og:description", content: og.description },
          { property: "og:image", content: og.image },
          { property: "og:url", content: og.url },
          { property: "og:type", content: og.type },
          { property: "og:locale", content: og.locale },
          // Twitter Card
          { name: "twitter:card", content: twitter.card },
          { name: "twitter:title", content: twitter.title },
          { name: "twitter:description", content: twitter.description },
          { name: "twitter:image", content: twitter.image },
        ],
        link: [
          { rel: "canonical", href: pageHead.canonical },
          { rel: "icon", href: essential.favicon },
          { rel: "stylesheet", href: essential.stylesheet },
        ],
        script: [{ src: essential.script, defer: true }],
      });
    }
  });
</script>

<style scoped>
  body {
    font-family: Arial, sans-serif;
  }
  header nav ul {
    list-style-type: none;
    padding: 0;
  }
  header nav ul li {
    display: inline;
    margin-right: 10px;
  }
  .breadcrumb {
    font-size: 14px;
  }
  figure {
    margin: 1em 0;
  }
  figcaption {
    font-size: 0.9em;
    color: #666;
  }
</style>
