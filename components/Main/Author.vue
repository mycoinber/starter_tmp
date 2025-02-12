<script setup>
  import { NuxtImg } from "#components";

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const formattedDate = computed(() => {
    return new Date(props.data.pubDate).toISOString().split("T")[0];
  });
</script>

<template>
  <div>
    <strong>{{ data.aiauthor.name }}</strong> | Date:
    <time :datetime="formattedDate">{{ formattedDate }}</time>
  </div>

  <NuxtImg
    v-for="(image, imgIndex) in data.aiauthor.images"
    :key="imgIndex"
    :src="`unsplash${image?.path}`"
    :alt="image?.title"
    width="400"
    itemprop="image"
  />
  <div>{{ data.aiauthor.bio }}</div>
</template>

<style lang="scss" scoped></style>
