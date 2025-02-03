<script setup>
  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  // Генерация навигационных ссылок
  const navigationLinks = computed(() =>
    props.data?.pages.map((page, index) => ({
      name: index === 0 ? "Home" : page.head.title, // Первая страница — "Home", остальные — h1
      slug: index === 0 ? "" : page.slug, // Используем slug для маршрута
    }))
  );

  console.log("props.data", props.data);
</script>

<template>
  <div>
    <NuxtImg
      v-if="data.logo?.length"
      :src="`unsplash${data.logo[0]?.path}`"
      :alt="data.logo[0]?.title"
      width="400"
    />
    <nav>
      <ul>
        <li v-for="(link, index) in navigationLinks" :key="index">
          <!-- Используем NuxtLink для маршрутов -->
          <NuxtLink :to="`/${link.slug}`">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
