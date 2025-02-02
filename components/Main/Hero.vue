<script setup>
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  // Разбираем контент первой секции
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
  <div>
    <section :id="data.sections?.[0]?.key"></section>
    <NuxtImg
      v-if="data.sections?.[0]?.images?.length"
      :src="`unsplash${data.sections[0].images[0]?.path}`"
      :alt="data.sections[0].images[0]?.title"
      width="400"
    />
    <h1>{{ data.h1 }}</h1>
    <h2 v-if="sectionContent.heading">{{ sectionContent.heading }}</h2>
    <div v-html="sectionContent.body"></div>
  </div>
</template>
