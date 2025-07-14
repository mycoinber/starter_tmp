<template>
  <main>
    <Main v-if="data?.type" :data="data" />
  </main>
</template>

<script setup>
import { useNuxtApp, useRequestURL, useRoute, useHead, useRuntimeConfig } from '#app';
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';


// Initialize core Nuxt utilities
const { $axios } = useNuxtApp();
const { locale } = useI18n();
const route = useRoute();
const config = useRuntimeConfig();
const url = useRequestURL();

// Compute site domain
const siteDomain = `${url.protocol}//${url.host}`;

// Determine siteId based on environment
const siteId = import.meta.server ? config.server.siteId : config.public.siteId;

// Handle slug from route params
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[1] || route.params.slug[0]
  : route.params.slug?.trim() || '';

// Skip system requests (e.g., favicon, sitemap, robots, etc.)
const systemPaths = ['favicon.ico', 'sitemap.xml', 'robots.txt', 'manifest.json', 'service-worker.js'];
if (!slug || systemPaths.some((path) => route.path.includes(path))) {
  throw createError({ statusCode: 404, message: 'Page not found' });
}


console.log('SSR?', import.meta.server);
const pageKey = computed(() => `page:${siteId}:${slug}`);
const { data } = await useAsyncData(pageKey.value, () =>
  $fetch('/api/pages/page-by-slug', {
    query: { slug, siteId },
    server: true,
    lazy: false,
  })
);


if (data.value?.redirect?.to && import.meta.server) {
  await navigateTo(data.value.redirect.to, { redirectCode: data.value.redirect.statusCode || 301 });
}

// Parse global head tags from runtimeConfig
const globalHeadRaw = import.meta.server ? config.server.globalHead : config.public.globalHead;
const globalHead = {
  link: globalHeadRaw
    .filter((tag) => tag.startsWith('<link'))
    .map((tag) => Object.fromEntries(
      Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value])
    )),
  meta: globalHeadRaw
    .filter((tag) => tag.startsWith('<meta'))
    .map((tag) => Object.fromEntries(
      Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value])
    )),
};

// Apply SEO and tracking configurations
if (data.value) {
  const pageHead = data.value.head || {};
  const domain = data.value.domain || siteDomain;

  // Set locale
  locale.value = data.value.lang || 'en';

  // Compute language for alternate links
  const lang = computed(() =>
    data.value.alters?.find((alter) => alter.slug === route.params.slug?.[0])?.hreflang || data.value.lang || 'tr'
  );

  // Set local SEO headers
  useHead({
    htmlAttrs: { lang: lang.value },
    title: pageHead.title || 'Sweet Bonanza Oyunu Oyna | Büyük Kazançları Yakala!',
    meta: [
      { name: 'description', content: pageHead.description },
      { name: 'keywords', content: pageHead.keywords },
      { property: 'og:title', content: pageHead.title },
      { property: 'og:description', content: pageHead.description },
      { property: 'og:image', content: data.value.article?.introImage?.[0]?.path },
      { property: 'og:url', content: `${domain}/${data.value.slug}` },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: 'tr_TR' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageHead.title },
      { name: 'twitter:description', content: pageHead.description },
      { name: 'twitter:image', content: data.value.article?.introImage?.[0]?.path },
    ],
    link: [
      { rel: 'canonical', href: `${domain}${data.value.homePage ? '' : `/${data.value.slug}`}/` },
      { rel: 'alternate', hreflang: data.value.lang || 'en', href: `${siteDomain}${data.value.homePage ? '' : `/${data.value.slug}`}/` },
      ...(data.value.alters?.map((alter) => ({
        rel: 'alternate',
        hreflang: alter.hreflang,
        href: `${siteDomain}/${alter.slug}${data.value.homePage ? '' : `/${data.value.slug}`}/`,
      })) || []),
    ],
  });

  // Apply robots meta tags
  if (data.value.robots?.metaTags) {
    useHead({
      meta: data.value.robots.metaTags.map((tag) => ({
        name: tag.name,
        content: tag.content,
      })),
    });
  }

  // Apply global headers
  useHead({
    meta: globalHead.meta,
    link: globalHead.link,
  });

  // Add Facebook Pixel tracking
  if (Array.isArray(data.value.pixel) && data.value.pixel.length > 0) {
    useHead({
      script: [{
        innerHTML: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          ${data.value.pixel.map((pixelId) => `fbq('init', '${pixelId}');`).join('\n')}
          fbq('track', 'PageView');
        `,
      }],
      noscript: data.value.pixel.map((pixelId) => ({
        innerHTML: `
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
        `,
      })),
    });
  }

  // Add Google Tag Manager
  if (Array.isArray(data.value.gtm) && data.value.gtm.length > 0) {
    useHead({
      script: data.value.gtm.map((gtmId, index) => ({
        key: `gtm-script-${index}`,
        innerHTML: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `,
      })),
      noscript: data.value.gtm.map((gtmId, index) => ({
        key: `gtm-noscript-${index}`,
        innerHTML: `
          <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
        `,
      })),
    });
  }
}
</script>