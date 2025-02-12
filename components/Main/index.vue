<script setup>
  import MainSection from "@/components/Main/Section.vue";
  import MainTable from "@/components/Main/Table.vue";

  const componentMap = {
    table: MainTable,
    section: MainSection,
  };

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<template>
  <MainHero />
  <h1>{{ data.h1 }}</h1>
  <MainTableOfContent
    v-if="data.sections && data.sections.length"
    :data="data"
  />
  <div v-if="data.sections">
    <component
      v-for="(item, index) in data.sections"
      :is="componentMap[item.type] || MainSection"
      :key="index"
      :data="item"
    />
  </div>
  <MainAuthor v-if="data.aiauthor" :data="data" />
  <MainReview v-if="data.reviews" :data="data" />
</template>

<style lang="scss"></style>
