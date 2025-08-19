<template>
  <main>
    <Main :data="data" />
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
const slug = route.params.slug || null;

const { data, status, error } = await usePageData(siteId, slug);

// ---------- HEAD LOGIC ----------

// 1. Все необходимые данные
const pageHead = computed(() => data.value?.head || {});
const pageLang = computed(() => data.value?.lang || "en");
const pageDomain = computed(() => data.value?.domain || siteDomain);
const pageSlug = computed(() => data.value?.slug || "");

const globalHeadRaw = import.meta.server
  ? config.server.globalHead
  : config.public.globalHead;

// 2. Глобальные meta/link (из строки в объект)
const globalHead = {
  link: (globalHeadRaw || [])
    .filter(tag => tag.startsWith("<link"))
    .map(tag => Object.fromEntries(Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value]))),
  meta: (globalHeadRaw || [])
    .filter(tag => tag.startsWith("<meta"))
    .map(tag => Object.fromEntries(Array.from(tag.matchAll(/(\w+)=["'](.*?)["']/g)).map(([_, name, value]) => [name, value]))),
};

// 3. Сбор всех meta с учетом robots и robots.metaTags
const headMeta = computed(() => {
  // 1. Базовые meta-теги (description, og, twitter)
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

  // Page meta (индивидуальные теги)
  const metaArray = Array.isArray(pageHead.value.meta) ? pageHead.value.meta : [];
  // Глобальные meta
  const globalMeta = globalHead.meta || [];
  // robots.metaTags (все из глобального robots-объекта)
  const robotsMetaTags = Array.isArray(data.value?.robots?.metaTags) ? data.value.robots.metaTags : [];

  // 1. Оставляем только один robots (приоритет: page meta > robots.metaTags)
  let robotsMeta = metaArray.find(m => m.key === "robots" && m.type === "name")
    || robotsMetaTags.find(m => m.name === "robots");

  // 2. Остальные robots.metaTags (кроме robots)
  const robotsOtherMeta = robotsMetaTags.filter(m => m.name !== "robots");

  // 3. Все meta из pageHead, кроме robots
  const metaWithoutRobots = metaArray.filter(m => m.key !== "robots");

  // 4. Добавляем robotsOtherMeta только если их нет в page meta и global meta
  // (по name)
  const usedNames = new Set([
    ...metaWithoutRobots.map(m => m.key),
    ...(globalMeta.map(m => m.name).filter(Boolean)),
  ]);
  const robotsOtherMetaFiltered = robotsOtherMeta.filter(m => !usedNames.has(m.name));

  // Итоговая сборка
  const result = [
    ...baseMeta,
    ...metaWithoutRobots.map(m => ({
      [m.type === "property" ? "property" : m.type === "httpEquiv" ? "httpEquiv" : "name"]: m.key,
      content: m.content
    })),
    ...(robotsMeta ? [{
      name: "robots",
      content: robotsMeta.content || robotsMeta.value // под разные форматы
    }] : []),
    ...robotsOtherMetaFiltered.map(m => ({
      name: m.name,
      content: m.content
    })),
    ...globalMeta
  ];

  return result;
});

// 4. Сбор всех link
const headLinks = computed(() => [
  { rel: "canonical", href: `${pageDomain.value}/` },
  { rel: "alternate", hreflang: pageLang.value, href: `${siteDomain}/` },
  ...(Array.isArray(data.value?.alters) ? data.value.alters.map(alter => ({
    rel: "alternate",
    hreflang: alter.hreflang,
    href: `${siteDomain}/${alter.slug}/`
  })) : []),
  ...(globalHead.link || []),
]);

// 5. Сбор всех script
const headScripts = computed(() => [
  // Facebook Pixel
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
  // Google Tag Manager
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

// 6. Сбор всех noscript
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

// 7. Один вызов useHead
useHead({
  htmlAttrs: { lang: pageLang.value },
  title: pageHead.value.title || "Website",
  meta: headMeta.value,
  link: headLinks.value,
  script: headScripts.value,
  noscript: headNoScripts.value,
});

// 8. Установи локаль, если нужно
if (data.value?.lang) {
  locale.value = data.value.lang;
}
</script>
