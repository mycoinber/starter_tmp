<script setup>
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
  <section :class="styles.block">
    <div class="container">
      <div :class="styles.wrapper">
        <h1 :class="styles.title">{{ data.h1 }}</h1>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
.block {
  margin: 2rem 0;

  @include media(mobile) {
    margin: 1rem 0;
  }
}

.title {
  text-align: center;
}
</style>
