<template>
  <main>
    <Main v-if="data?.type && data?.type === 'blog'" :data="data" />
    <Policy v-else :data="data" />
  </main>
</template>

<script setup>
  import { useNuxtApp } from "#app";
  import { useQuery } from "@tanstack/vue-query";

  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();
  const siteId = import.meta.server
    ? config.server.siteId
    : config.public.siteId;
  const route = useRoute();

  const slug = route.params.slug;
  const fetchPage = async (siteId, slug = null) => {
    const params = { siteId };
    if (slug) {
      params.slug = slug;
    }
    const response = await $axios.get("/pages/page-by-slug", { params });
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
      console.log("data.value", data.value);
      const pageHead = data.value.head;
      const og = pageHead?.open_graph || {};
      const twitter = pageHead?.twitter_card || {};
      const essential = pageHead?.essential_links || {};

      useHead({
        htmlAttrs: {
          lang: og.locale || "",
        },
        title: pageHead.title || "",
        meta: [
          // Основные мета-теги
          { name: "description", content: pageHead.meta_description },
          { name: "keywords", content: pageHead.keywords },
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

      useSchemaOrg([
        defineWebPage({
          name: data.value.aiauthor.name || "",
          description: data.value.aiauthor.bio || "",
        }),
        defineArticle({
          headline: data.value.title || "",
          datePublished: data.value.createdDate || "",
          dateModified: data.value.updateDate || "",
          author: {
            name: data.value.aiauthor.name || "",
            // url: "https://example.com/author",
          },
          inLanguage: og.locale || "",
          image: "https://example.com/cover.jpg",
          // articleBody: "Основной контент статьи...",
        }),
        ...(data.value.faqs?.data?.length > 0
          ? [
              {
                "@type": "FAQPage",
                mainEntity: data.value.faqs.data.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              },
            ]
          : []),
        ...(data.value.reviews?.data?.length > 0
          ? [
              {
                "@type": "Review",
                reviewAspect: "Sweet Bonanza",
                reviewBody: data.value.reviews.data.map((review) => ({
                  "@type": "Review",
                  reviewBody: review.review,
                  datePublished: review.date,
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: review.rating,
                    bestRating: "5",
                  },
                  author: {
                    "@type": "Person",
                    name: review.name,
                  },
                  ...(review.images?.length > 0
                    ? {
                        image: review.images.map((image) => ({
                          "@type": "ImageObject",
                          url: image.path,
                          caption: image.alt,
                        })),
                      }
                    : {}),
                })),
              },
            ]
          : []),
      ]);
    }
  });
</script>
