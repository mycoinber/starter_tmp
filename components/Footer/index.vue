<script setup>
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
  <footer class="footer">
    <div class="container">
      <div class="footer__wrapper">
        <div class="footer__content">
          <div class="logo">
            <NuxtLink to="/">
              <NuxtImg
                v-if="data.logo?.length"
                :src="`unsplash${data.logo[0]?.path}`"
                :alt="data.logo[0]?.title"
                width="400"
              />
            </NuxtLink>
          </div>

          <nav class="nav">
            <ul class="nav__list">
              <li
                v-for="(link, index) in navigationLinks"
                :key="index"
                class="nav__item"
              >
                <NuxtLink :to="`/${link.slug}`">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div class="footer__copy">&#169; Copyright 2025. Sitename</div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
  .footer {
    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 3rem 0 1rem;
    }

    &__content {
      display: flex;
      align-items: center;
      gap: 5rem;
    }

    &__copy {
      text-align: center;
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
      gap: 1rem;
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

        &:hover {
          color: $color-2;
        }

        &.router-link-active {
          color: $color-2;
        }
      }
    }
  }
</style>
