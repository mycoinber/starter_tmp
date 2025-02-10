<script setup>
import { useCssModule } from 'vue';
import MainSection from '@/components/Main/Section.vue';
import MainFaq from '@/components/Main/Faq.vue';
import MainReview from '@/components/Main/Review.vue';
import MainTable from '@/components/Main/Table.vue';

const styles = useCssModule();

const componentMap = {
  table: MainTable,
  section: MainSection,
  faq: MainFaq,
  reviews: MainReview,
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

  <MainTableOfContent v-if="data.sections && data.sections.length" :data="data" />

  <component v-if="data.sections && data.sections.length" :is="componentMap[data.sections[0].type] || MainSection"
    :data="data.sections[0]" />

  <div v-if="data.sections && data.sections.length > 1">
    <component v-for="(item, index) in data.sections.slice(1)" :is="componentMap[item.type] || MainSection" :key="index"
      :data="item" />
  </div>
</template>

<style lang="scss" scoped module></style>
