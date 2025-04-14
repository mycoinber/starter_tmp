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
const isBot = useState("isBot", () => false);

if (import.meta.server) {
  const event = useRequestEvent();
  isBot.value = event.context.isBot || false;
} else {
  onMounted(() => {
    setTimeout(() => {
      isLoaded.value = true;
    }, 100);
  });
}
</script>

<template>
  <div v-if="!isLoaded" :class="styles.loaderContainer">
    <MainLoader />
  </div>
  <section :class="styles.block">
    <div class="container">
      <DelayHydration>
        <MainHero v-if="!isBot" :data="data" />
      </DelayHydration>
      <div :class="styles.img">
        <NuxtImg :src="`unsplash${data.hero[0]?.path}`" :alt="data.hero[0]?.alt || 'hero'" width="800" loading="lazy"
          quality="75" sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:33vw" />
      </div>
    </div>
  </section>
  <MainTitle v-if="data.H1" :data="data" />

  <MainTableOfContent v-if="data.sections && data.sections.length" :data="data" />

  <MainSection v-for="(item, index) in sections" :data="item" />

  <DelayHydration>
    <MainFaq v-if="faqs" :data="faqs" />
  </DelayHydration>

  <MainAuthor v-if="data.aiauthor" :data="data" />

  <MainReview v-if="reviews" :data="reviews" />
</template>

<style lang="scss" scoped module>
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

.block {
  width: 100%;
  height: 65rem;
  position: relative;
  z-index: 2;
  margin-bottom: 4rem;

  @include media(mobile) {
    height: fit-content;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    z-index: -1;
    background: linear-gradient(to bottom,
        rgba(255, 255, 255, 0),
        var(--background-01));
    pointer-events: none;
  }
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @include media(mobile) {
      object-fit: contain;
      object-position: top center;
    }
  }
}
</style>
