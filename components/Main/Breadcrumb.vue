<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const breadcrumbs = computed(() => {
    const paths = route.path.split("/").filter(Boolean);
    let fullPath = "";
    return [
      { name: "Главная", path: "/" },
      ...paths.map((segment) => {
        fullPath += `/${segment}`;
        return { name: decodeURIComponent(segment), path: fullPath };
      }),
    ];
  });
</script>

<template>
  <nav aria-label="breadcrumb" class="text-sm">
    <ul class="flex space-x-2 text-gray-600">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="flex items-center"
      >
        <NuxtLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="text-blue-600 hover:underline"
        >
          {{ crumb.name }}
        </NuxtLink>
        <span v-else class="text-gray-900">{{ crumb.name }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="mx-1">/</span>
      </li>
    </ul>
  </nav>
</template>
