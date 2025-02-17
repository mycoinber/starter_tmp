<script setup>
  import { useCssModule } from "vue";
  import { useNuxtApp } from "#app";
  import { useAsyncData } from "#app";

  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();
  const siteId = import.meta.server
    ? config.server.siteId
    : config.public.siteId;
  const styles = useCssModule();
  console.log(siteId);
  // Функция для получения страниц
  const fetchPages = async (siteId) => {
    try {
      console.log("Запрос данных для siteId:", siteId); // Логирование запроса
      const response = await $axios.get(`/pages/nav?siteId=${siteId}`);
      console.log("Ответ от API:", response.data); // Логирование ответа
      return response.data;
    } catch (error) {
      console.error("Ошибка при запросе данных:", error);
      throw error;
    }
  };

  // Используем useAsyncData для загрузки данных
  const { data, error } = useAsyncData("pages", () => fetchPages(siteId), {
    ssr: true, // Включаем SSR, чтобы данные были загружены на сервере до рендеринга
  });

  // Логика обработки ошибок
  const hasError = error.value;
</script>

<template>
  <article :class="styles.article">
    <!-- Дождёмся, пока данные загрузятся или появится ошибка -->
    <div v-if="hasError">Произошла ошибка при загрузке данных</div>

    <!-- Отображение данных, только если они загружены -->
    <Header v-if="data && !hasError" :data="data" />

    <slot />

    <Footer v-if="data && !hasError" :data="data" />
  </article>
</template>

<style lang="scss" scoped module>
  .article {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url("/ornament.svg");
      z-index: -2;
    }
  }
</style>
