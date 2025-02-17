<script setup>
  import PolicySection from "@/components/Policy/Section.vue";
  import PolicyTable from "@/components/Policy/Table.vue";
  import { useCssModule } from "vue";

  const styles = useCssModule();

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

  const isLoaded = ref(false);

  onMounted(() => {
    setTimeout(() => {
      isLoaded.value = true;
    }, 100);
  });
</script>

<template>
  <div v-if="!isLoaded" :class="styles.loaderContainer">
    <PolicyLoader />
  </div>

  <PolicyHero v-if="isLoaded" />

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

  <PolicyReview v-if="data.reviews" :data="data" />
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
