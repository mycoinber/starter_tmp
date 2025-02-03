<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <MainHero v-if="data.sections && data.sections.length" :data="data" />

  <MainTableOfContent v-if="data.sections && data.sections.length" :data="data" />

  <MainSection v-if="data.sections && data.sections.length > 1" v-for="(item, index) in data.sections.slice(1)"
    :key="index" :data="item" />
</template>

<style scoped></style>
