<script setup>
import { useCssModule } from "vue";
const styles = useCssModule();

import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const publishedDateISO = computed(() => {
  const date = new Date(props.data.pubDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`; // 2001-05-15 19:00
});

const formattedDate = computed(() => {
  return new Date(props.data.pubDate).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});
</script>

<template>
  <section :class="styles.author">
    <div class="container">
      <div :class="styles.wrapper">

        <div :class="styles.img">
          <NuxtImg v-for="(image, imgIndex) in data.aiauthor.images" :key="imgIndex" :src="`unsplash${image?.path}`"
            :alt="image?.title" width="400" />
        </div>

        <div :class="styles.content">
          <div :class="styles.info">
            <div :class="styles.head">
              <h3 :class="styles.title">{{ data.aiauthor.name }}</h3>

              <time :datetime="publishedDateISO" :class="styles.date">{{ formattedDate }}</time>
            </div>

            <span :class="styles.subtitle">Автор</span>
          </div>

          <p :class="styles.text">{{ data.aiauthor.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
.wrapper {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  border: 0.063rem solid var(--border);
  border-radius: 0.625rem;
  background: var(--background-02);

  @include media(mobile) {
    flex-direction: column;
    gap: 1rem;
  }
}

.img {
  display: block;
  width: 5rem;
  min-width: 5rem;
  height: 5rem;
  min-height: 5rem;
  background: var(--background-02);
  border-radius: 50%;
  border: 0.063rem solid var(--border);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @include media(mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.date {
  opacity: 0.5;
  font-size: 0.875rem;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  margin: 0;
  padding: 0;
}

.subtitle {
  font-size: 0.875rem;
  opacity: 0.5;
}
</style>
