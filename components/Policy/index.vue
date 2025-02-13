<script setup>
  import PolicySection from "@/components/Policy/Section.vue";
  import PolicyTable from "@/components/Policy/Table.vue";

  const componentMap = {
    table: PolicyTable,
    section: PolicySection,
  };

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<template>
  <PolicyHero />

  <PolicyTitle v-if="data.h1" :data="data" />

  <PolicyTableOfContent
    v-if="data.sections && data.sections.length"
    :data="data"
  />

  <component
    v-if="data.sections"
    v-for="(item, index) in data.sections"
    :is="componentMap[item.type] || PolicySection"
    :key="index"
    :data="item"
  />

  <PolicyFaq v-if="data.faqs" :data="data" />

  <PolicyAuthor v-if="data.aiauthor" :data="data" />

  <PolicyReview v-if="data.reviews" :data="data" />
</template>

<style lang="scss"></style>
