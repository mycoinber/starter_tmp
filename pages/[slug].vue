<template>
  <main>
    <Main v-if="data?.type" :data="data" />
  </main>
</template>

<script setup>
  import { useNuxtApp } from "#app";
  import { useRequestURL } from "#app";

  const url = useRequestURL();
  const siteDomain = `${url.protocol}//${url.host}`;

const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const siteId = import.meta.server
  ? config.server.siteId
  : config.public.siteId;
const route = useRoute();

const slug = route.params.slug;

// Функция для получения данных страницы
const fetchPage = async (siteId, slug = null) => {
  const params = { siteId };
  if (slug) params.slug = slug;

  try {
    const response = await $axios.get("/pages/page-by-slug", { params });
    return response.data;
  } catch (error) {
    console.error("Ошибка запроса:", error.message);
    console.error("Код состояния:", error.response?.status);
    console.error("Детали ошибки:", error.response?.data);
    throw error;
  }
};

// Получаем данные страницы
const { data } = await useAsyncData(
  `page-${slug}-${siteId}`,
  () => fetchPage(siteId, slug),
  {
    server: true,
  }
);

// Парсим глобальные заголовки из runtimeConfig
const globalHeadRaw = import.meta.server
  ? config.server.globalHead
  : config.public.globalHead;
const globalHead = {
  link: globalHeadRaw
    .filter((tag) => tag.startsWith("<link"))
    .map((tag) => {
      const attributes = Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g));
      return Object.fromEntries(
        attributes.map(([_, name, value]) => [name, value])
      );
    }),
  meta: globalHeadRaw
    .filter((tag) => tag.startsWith("<meta"))
    .map((tag) => {
      const attributes = Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g));
      return Object.fromEntries(
        attributes.map(([_, name, value]) => [name, value])
      );
    }),
};

  // Применяем заголовки
  if (data.value) {
    const pageHead = data.value.head || {};
    const domain = data.value.domain || siteDomain;

  // Локальные заголовки (рендерятся первыми)
  useHead({
    htmlAttrs: {
      lang: data.value.lang || "tr",
    },
    title:
      pageHead.title || "Sweet Bonanza Oyunu Oyna | Büyük Kazançları Yakala!",
    meta: [
      { name: "description", content: pageHead.description },
      { name: "keywords", content: pageHead.keywords },
      {
        name: "robots",
        content:
          data.value.robots?.metaTags?.[0]?.content ||
          pageHead.robots ||
          "index, follow",
      },
      { property: "og:title", content: pageHead.title },
      { property: "og:description", content: pageHead.description },
      {
        property: "og:image",
        content: data.value.article?.introImage?.[0]?.path,
      },
      {
        property: "og:url",
        content: `${domain}/${data.value.slug}`,
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "tr_TR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: pageHead.title },
      { name: "twitter:description", content: pageHead.description },
      {
        name: "twitter:image",
        content: data.value.article?.introImage?.[0]?.path,
      },
    ],
    link: [{ rel: "canonical", href: `${domain}/${data.value.slug}` }],
  });

  // Глобальные заголовки из site.json (рендерятся после локальных)
  useHead({
    meta: globalHead.meta,
    link: globalHead.link,
  });

  // Настройка useSchemaOrg
  if (data.value.ldJson && Array.isArray(data.value.ldJson)) {

    useSchemaOrg(
      data.value.ldJson.map((item) => {
        switch (item["@type"]) {
          case "Article":
            return defineArticle({
              headline: item.headline,
              description: item.description,
              datePublished: item.datePublished || data.value.createdAt,
              dateModified: item.dateModified || data.value.updatedAt,
              author: {
                "@type": "Person",
                name:
                  item.author?.name ||
                  data.value.aiauthor?.name ||
                  "Example Author",
              },
              publisher: {
                "@type": "Organization",
                name: item.publisher?.name || "Example Site",
                logo: item.publisher?.logo || {
                  "@type": "ImageObject",
                  url: "https://example.com/logo.png",
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                  item.mainEntityOfPage?.["@id"] ||
                  `${domain}/${data.value.slug}`,
              },
              wordCount: item.wordCount || data.value.article?.word_count,
              inLanguage: item.inLanguage || "tr",
              image: data.value.article?.introImage?.[0]?.path || item.image,
            });

          case "BreadcrumbList":
            return defineBreadcrumb({
              itemListElement: item.itemListElement.map(
                (breadcrumb, index) => ({
                  "@type": "ListItem",
                  position: breadcrumb.position || index + 1,
                  name: breadcrumb.name,
                  item: breadcrumb.item,
                })
              ),
            });

          case "FAQPage":
            return {
              "@type": "FAQPage",
              mainEntity: item.mainEntity.map((faq) => ({
                "@type": "Question",
                name: faq.name,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.acceptedAnswer.text,
                },
              })),
            };

          case "Review":
            return {
              "@type": "Review",
              itemReviewed: {
                "@type": "CreativeWork",
                name: item.itemReviewed?.name || "Sweet Bonanza Oyunu Oyna",
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: item.reviewRating?.ratingValue || 5,
                bestRating: item.reviewRating?.bestRating || 5,
              },
              author: {
                "@type": "Person",
                name: item.author?.name,
              },
              reviewBody: item.reviewBody,
              datePublished: item.datePublished || data.value.createdAt,
            };

          default:
            return item;
        }
      })
    );
  } else {
    console.warn("ldJson отсутствует или не массив:", data.value?.ldJson);
    useSchemaOrg([
      defineWebPage({
        name: pageHead.title || "Sweet Bonanza Oyunu Oyna",
        url: `${domain}/${data.value.slug}`,
      }),
    ]);
  }
}
</script>
