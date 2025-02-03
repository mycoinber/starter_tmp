<script setup>
import { useNuxtApp } from "#app";
import { useAsyncData } from "#app";

const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const siteId = config.public.siteId;

// Функция для получения страниц
const fetchPages = async (siteId) => {
  try {
    const response = await $axios.get(`/pages/nav?siteId=${siteId}`);
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
  <article class="page">
    <Header :data="data" />

    <slot />

    <Footer :data="data" />
  </article>
</template>

<style lang="scss" scoped></style>
