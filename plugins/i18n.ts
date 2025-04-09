// plugins/i18n.ts
import { createI18n } from 'vue-i18n';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true, // ← чтобы можно было использовать $t() без импорта
    locale: 'en', // дефолт
    fallbackLocale: 'en',
    messages: {} // загружаем позже
  });

  nuxtApp.vueApp.use(i18n);
});