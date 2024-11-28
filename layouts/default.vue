<script setup>
  import { useNuxtApp } from "#app";
  import { useAsyncData } from "#app";

  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();
  const siteId = config.public.siteId;

  // Функция для получения страниц
  const fetchPages = async (siteId) => {
    try {
      const response = await $axios.get(
        `/pages/getAllSitePages?siteId=${siteId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  };

  // Используем useAsyncData для загрузки данных
  const { data, error } = useAsyncData("pages", () => fetchPages(siteId));
</script>

<template>
  <div>
    <Header :data="data?.pages" />
    <slot />
  </div>
</template>

<style scoped>
  .container {
    width: calc(100vw - 10rem);
    margin: 0 auto;
    max-width: 100%;
  }
</style>
