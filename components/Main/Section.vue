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
  <section :id="data.key">
    <div class="container">
      <div>
        <div v-html="data.content"></div>

        <NuxtImg v-if="data.images && data.images.length !== 0" :src="`unsplash${data.images[0]?.path}`"
          :alt="data.images[0]?.title" width="400" />
      </div>
    </div>
  </section>
</template>
