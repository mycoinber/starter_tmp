<script setup>
import { useCssModule } from 'vue';
import { useNuxtApp } from "#app";
import { useAsyncData } from "#app";

const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const siteId = config.public.siteId;
const styles = useCssModule();

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
  <article :class="styles.article">
    <Header :data="data" />

    <slot />

    <Footer :data="data" />
  </article>
</template>

<style lang="scss" scoped module>
.article {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('/ornament.svg');
    z-index: -2;
  }
}
</style>
