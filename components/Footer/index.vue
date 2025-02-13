<script setup>
import { useCssModule } from "vue";
const styles = useCssModule();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const navigationLinks = computed(() =>
  props.data?.pages.map((page, index) => ({
    name: index === 0 ? "Home" : page.head.title,
    slug: index === 0 ? "" : page.slug,
  }))
);
</script>

<template>
  <footer :class="styles.footer">
    <div class="container">
      <div :class="styles.wrapper">
        <div :class="styles.content">
          <div :class="styles.logo">
            <NuxtLink to="/">
              <NuxtImg v-if="data.logo?.length" :src="`unsplash${data.logo[0]?.path}`" :alt="data.logo[0]?.title"
                width="400" />
            </NuxtLink>
          </div>

          <nav :class="styles.nav">
            <ul :class="styles.navList">
              <li v-for="(link, index) in navigationLinks" :key="index" :class="styles.navItem">
                <NuxtLink :to="`/${link.slug}`">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div :class="styles.copy">&#169; Copyright 2025. Sitename</div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem 0 1rem;

  @include media(mobile) {
    align-items: flex-start;
  }
}

.content {
  display: flex;
  align-items: center;
  gap: 5rem;

  @include media(mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.copy {
  width: 100%;
  text-align: center;
  opacity: 0.5;
}

.logo {
  height: 5rem;
  min-height: 5rem;
  border-radius: 0.25rem;
  overflow: hidden;

  a {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.navList {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @include media(mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.675rem;
  }
}

.navItem {
  margin: 0;

  a {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    line-height: 120%;
    transition: color 0.3s;
    color: var(--color-white);
    text-align: center;

    @include media(mobile) {
      text-align: left;
    }

    &:hover {
      color: var(--color-01);
    }
  }
}
</style>
