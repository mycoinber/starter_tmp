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

  <MainTitle v-if="data.h1" :data="data" />

  <MainTableOfContent v-if="data.sections && data.sections.length" :data="data" />

  <component v-if="data.sections" v-for="(item, index) in data.sections" :is="componentMap[item.type] || MainSection"
    :key="index" :data="item" />

  <MainFaq v-if="data.faqs" :data="data" />

  <MainAuthor v-if="data.aiauthor" :data="data" />

  <MainReview v-if="data.reviews" :data="data" />
</template>

<style lang="scss"></style>
