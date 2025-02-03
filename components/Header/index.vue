<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
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
  <header class="header">
    <div class="container">
      <div class="header__wrapper">
        <div class="logo">
          <NuxtLink to="/">
            <NuxtImg v-if="data.logo?.length" :src="`unsplash${data.logo[0]?.path}`" :alt="data.logo[0]?.title"
              width="400" />
          </NuxtLink>
        </div>

        <nav class="nav">
          <ul class="nav__list">
            <li v-for="(link, index) in navigationLinks" :key="index" class="nav__item">
              <NuxtLink :to="`/${link.slug}`">{{ link.name }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: $color-bg;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
  }
}

.logo {
  height: 5rem;

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

.nav {
  &__list {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
  }

  &__item {
    a {
      display: block;
      font-size: 1rem;
      font-weight: 500;
      white-space: nowrap;
      position: relative;
      transition: color 0.3s;

      &:after {
        content: '';
        position: absolute;
        top: 120%;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 100%;
        height: 0.125rem;
        background: $color-2;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        color: $color-2;
      }

      &.router-link-active {
        color: $color-2;

        &:after {
          opacity: 1;
        }
      }
    }
  }
}
</style>