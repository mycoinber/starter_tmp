<script setup>
  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  // Генерация навигационных ссылок
  const navigationLinks = computed(() =>
    props.data.map((page, index) => ({
      name: index === 0 ? "Home" : page.head.title, // Первая страница — "Home", остальные — h1
      slug: index === 0 ? "" : page.slug, // Используем slug для маршрута
    }))
  );

  console.log(props.data);
</script>

<template>
  <nav>
    <ul>
      <li v-for="(link, index) in navigationLinks" :key="index">
        <!-- Используем NuxtLink для маршрутов -->
        <NuxtLink :to="`/${link.slug}`">{{ link.name }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
