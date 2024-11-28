<template>
  <div>
    <MainHero :data="data" />
    <MainSection
      v-if="data.sections"
      v-for="(item, index) in data.sections"
      :key="index"
      :data="item"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<style scoped>
  body {
    font-family: Arial, sans-serif;
  }
  header nav ul {
    list-style-type: none;
    padding: 0;
  }
  header nav ul li {
    display: inline;
    margin-right: 10px;
  }
  .breadcrumb {
    font-size: 14px;
  }
  figure {
    margin: 1em 0;
  }
  figcaption {
    font-size: 0.9em;
    color: #666;
  }
</style>
