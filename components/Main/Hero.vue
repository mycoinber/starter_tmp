<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const sectionContent = computed(() => {
  const content = props.data?.sections?.[0]?.content || "";
  const match = content.match(/<h2>(.*?)<\/h2>(.*)/s);

  return {
    heading: match ? match[1].trim() : "",
    body: match ? match[2].trim() : content, // Если нет h2, берем весь текст
  };
});
</script>

<template>
  <section :id="data.sections?.[0]?.key" class="hero">
    <div class="container">
      <div class="hero__wrapper">
        <div class="hero__content">
          <h1 class="title">
            {{ data.h1 }}
          </h1>

          <h2 v-if="sectionContent.heading" class="heading">
            {{ sectionContent.heading }}
          </h2>

          <div v-html="sectionContent.body"></div>
        </div>

        <div class="hero__img">
          <NuxtImg v-if="data.sections?.[0]?.images?.length" :src="`unsplash${data.sections[0].images[0]?.path}`"
            :alt="data.sections[0].images[0]?.title" width="400" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 50%;
  }

  &__img {
    width: 50%;
    height: 50rem;
    border-radius: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
