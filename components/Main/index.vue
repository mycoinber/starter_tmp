<script setup>
  import { useCssModule } from "vue";

  const styles = useCssModule();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const faqs = computed(() => {
    return (
      props.data.article.blocks?.find(
        (item) => item.faqs && Array.isArray(item.faqs) && item.faqs.length > 0
      ) || null
    );
  });

  // Возвращаем первый блок с непустым reviews
  const reviews = computed(() => {
    return (
      props.data.article.blocks?.find(
        (item) =>
          item.reviews && Array.isArray(item.reviews) && item.reviews.length > 0
      ) || null
    );
  });

  const sections = computed(() => {
    return (
      props.data.article.blocks?.filter(
        (item) =>
          !(
            (item.faqs && Array.isArray(item.faqs) && item.faqs.length > 0) ||
            (item.reviews &&
              Array.isArray(item.reviews) &&
              item.reviews.length > 0)
          )
      ) || []
    );
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

  <MainHero v-if="isLoaded" :data="data" />

  <MainTitle v-if="data.H1" :data="data" />

  <MainTableOfContent
    v-if="data.sections && data.sections.length"
    :data="data"
  />

  <MainSection v-for="(item, index) in sections" :data="item" />

  <MainFaq v-if="faqs" :data="faqs" />

  <MainAuthor v-if="data.aiauthor" :data="data" />

  <MainReview v-if="reviews" :data="reviews" />
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
