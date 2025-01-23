<script setup>
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
  const config = useRuntimeConfig();

  const imageUrl = `unsplash${props.data.images[0]?.path}`;
</script>

<template>
  <section>
    <div v-html="data.content"></div>
    <NuxtImg
      v-if="data.image"
      :src="imageUrl"
      :alt="data.images[0]?.title"
      width="400"
    />
  </section>
</template>
