<template>
  <main>
    <Main v-if="data?.type" :data="data" />
  </main>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const url = useRequestURL();
const siteDomain = `${url.protocol}//${url.host}`;
const config = useRuntimeConfig();
const route = useRoute();

const siteId = import.meta.server ? config.server.siteId : config.public.siteId;

// Сборка slug-а из catch-all
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join("/") // можно доработать под твой формат
  : route.params.slug?.trim() || "";


if (isSystemPath(slug)) {
  throw createError({ statusCode: 404, message: "Page not found" });
}


// Получаем данные страницы (можешь вынести в usePageData)
const { data, status, error } = await usePageData(siteId, slug);

// --- HEAD LOGIC ---

const pageHead = computed(() => data.value?.head || {});
const pageLang = computed(() => data.value?.lang || "en");
const pageDomain = computed(() => data.value?.domain || siteDomain);
const pageSlug = computed(() => data.value?.slug || slug || "");

// Парсим глобальные <meta> и <link>
const globalHeadRaw = import.meta.server ? config.server.globalHead : config.public.globalHead;
const globalHead = {
  link: (globalHeadRaw || [])
    .filter(tag => tag.startsWith("<link"))
    .map(tag => Object.fromEntries(Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value]))),
  meta: (globalHeadRaw || [])
    .filter(tag => tag.startsWith("<meta"))
    .map(tag => Object.fromEntries(Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value]))),
};

const headMeta = computed(() => {
  const baseMeta = [
    { name: "description", content: pageHead.value.description },
    { name: "keywords", content: pageHead.value.keywords },
    { property: "og:title", content: pageHead.value.title },
    { property: "og:description", content: pageHead.value.description },
    { property: "og:image", content: data.value?.article?.introImage?.[0]?.path },
    { property: "og:url", content: `${pageDomain.value}/${pageSlug.value}` },
    { property: "og:type", content: "article" },
    { property: "og:locale", content: pageLang.value },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageHead.value.title },
    { name: "twitter:description", content: pageHead.value.description },
    { name: "twitter:image", content: data.value?.article?.introImage?.[0]?.path },
  ];

  const metaArray = Array.isArray(pageHead.value.meta) ? pageHead.value.meta : [];
  const metaWithoutRobots = metaArray.filter(m => !(m.key === 'robots' && m.type === 'name'));
  let robotsMeta = metaArray.find(m => m.key === 'robots' && m.type === 'name');
  if (!robotsMeta && Array.isArray(data.value?.robots?.metaTags)) {
    robotsMeta = data.value.robots.metaTags.find(m => m.name === 'robots');
  }

  const globalMeta = globalHead.meta || [];
  const result = [
    ...baseMeta,
    ...metaWithoutRobots.map(m => ({
      [m.type === 'property' ? 'property' : m.type === 'httpEquiv' ? 'httpEquiv' : 'name']: m.key,
      content: m.content
    })),
    ...(robotsMeta ? [{
      [robotsMeta.type === 'property' ? 'property' : robotsMeta.type === 'httpEquiv' ? 'httpEquiv' : 'name']: robotsMeta.key || robotsMeta.name,
      content: robotsMeta.content
    }] : []),
    ...globalMeta
  ];
  return result;
});

const headLinks = computed(() => [
  { rel: "canonical", href: `${pageDomain.value}/${pageSlug.value}` },
  { rel: "alternate", hreflang: pageLang.value, href: `${siteDomain}/${pageSlug.value}` },
  ...(Array.isArray(data.value?.alters) ? data.value.alters.map(alter => ({
    rel: "alternate",
    hreflang: alter.hreflang,
    href: `${siteDomain}/${alter.slug}/`
  })) : []),
  ...(globalHead.link || []),
]);

const headScripts = computed(() => [
  ...(Array.isArray(data.value?.pixel) && data.value.pixel.length > 0 ? [{
    innerHTML: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      ${data.value.pixel.map(pixelId => `fbq('init', '${pixelId}');`).join('\n')}
      fbq('track', 'PageView');
    `,
    type: "text/javascript"
  }] : []),
  ...(Array.isArray(data.value?.gtm) ? data.value.gtm.map((gtmId, index) => ({
    key: `gtm-script-${index}`,
    innerHTML: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `
  })) : [])
]);

const headNoScripts = computed(() => [
  ...(Array.isArray(data.value?.pixel) ? data.value.pixel.map(pixelId => ({
    innerHTML: `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
    `
  })) : []),
  ...(Array.isArray(data.value?.gtm) ? data.value.gtm.map((gtmId, index) => ({
    key: `gtm-noscript-${index}`,
    innerHTML: `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `
  })) : [])
]);

// Один вызов useHead
useHead({
  htmlAttrs: { lang: pageLang.value },
  title: pageHead.value.title || "Website",
  meta: headMeta.value,
  link: headLinks.value,
  script: headScripts.value,
  noscript: headNoScripts.value,
});

// Применяем локаль
if (data.value?.lang) {
  locale.value = data.value.lang;
}

// Редирект если надо
if (data.value?.redirect?.to && import.meta.server) {
  await navigateTo(data.value.redirect.to, { redirectCode: data.value.redirect.statusCode || 301 });
}
</script>
