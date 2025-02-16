<script setup>
import MainSection from "@/components/Main/Section.vue";
import MainTable from "@/components/Main/Table.vue";
import { useCssModule } from "vue";

const styles = useCssModule();

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

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

</script>

<template>
  <div v-if="!isLoaded" :class="styles.loaderContainer">
    <MainLoader />
  </div>

  <MainHero v-if="isLoaded" />

  <MainTitle v-if="data.h1" :data="data" />

  <MainTableOfContent v-if="data.sections && data.sections.length" :data="data" />

  <component v-if="data.sections" v-for="(item, index) in data.sections" :is="componentMap[item.type] || MainSection"
    :key="index" :data="item" />

  <MainFaq v-if="data.faqs" :data="data" />

  <MainAuthor v-if="data.aiauthor" :data="data" />

  <MainReview v-if="data.reviews" :data="data" />
</template>

<style scoped module>
.loaderContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-01);
  z-index: 9999;
}
</style>
