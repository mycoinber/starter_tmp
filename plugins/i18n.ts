import { createI18n } from 'vue-i18n'
import messages from '~/locales/messages.json'

console.log("messages", messages)

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages // Pass the entire messages object with all locales
  })

  nuxtApp.vueApp.use(i18n)
})