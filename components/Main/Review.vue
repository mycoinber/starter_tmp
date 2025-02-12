<script setup>
import { NuxtImg } from "#components";
import { useCssModule } from "vue";

const styles = useCssModule();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div v-if="data?.reviews.length" :class="styles.reviews">
    <h2 :class="styles.title">Отзывы</h2>

    <div v-for="(review, index) in data?.reviews" :key="index" :class="styles.review" itemscope
      itemtype="http://schema.org/Review">
      <div :class="styles.header">
        <span :class="styles.author" itemprop="author">
          {{ review.name }}
        </span>

        <span :class="styles.date" itemprop="datePublished">
          {{ review.date }}
        </span>

        <div :class="styles.rating" itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">
          <span itemprop="ratingValue">
            {{ review.rating }}
          </span>
          из 5
        </div>
      </div>

      <p :class="styles.body" itemprop="reviewBody">
        {{ review.review }}
      </p>

      <div :class="styles.images">
        <NuxtImg v-for="(image, imgIndex) in review.images" :key="imgIndex" :src="`unsplash${image?.path}`"
          :alt="image?.title" width="400" itemprop="image" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.reviews {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
}

.review {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.author {
  font-weight: bold;
}

.date {
  font-size: 14px;
  color: #666;
}

.rating {
  font-size: 16px;
  color: #ff9800;
}

.body {
  font-size: 16px;
  margin-top: 10px;
}

.images {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.images img {
  max-width: 100px;
  border-radius: 4px;
}
</style>
