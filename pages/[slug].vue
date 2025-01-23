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
  console.log(slug);
  const fetchPage = async (siteId, slug = null) => {
    const params = { siteId };

    // Добавляем slug только если он передан
    if (slug) {
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
  useHead({
    title: "Страхование - Путеводитель",
    meta: [
      {
        name: "description",
        content:
          "Полное руководство по выбору страхования, включая советы, преимущества и виды страховых полисов.",
      },
      {
        name: "keywords",
        content:
          "страхование, страховой полис, автострахование, страхование здоровья, страхование жизни",
      },
    ],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://example.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Страхование",
              item: "https://example.com/insurance",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Какой вид страхования мне выбрать?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Выбор зависит от ваших потребностей. Например, для владельцев автомобилей важно автострахование, а для семейных — страхование жизни.",
              },
            },
            {
              "@type": "Question",
              name: "Как рассчитать стоимость страхования?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Стоимость зависит от многих факторов: возраст, состояние здоровья, стоимость имущества и другие.",
              },
            },
          ],
        }),
      },
    ],
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
