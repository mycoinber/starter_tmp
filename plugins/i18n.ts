import { createI18n } from 'vue-i18n'
import en from '~/locales/local.json'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: en
  })

  nuxtApp.vueApp.use(i18n)
})
