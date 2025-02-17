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
  <header :class="styles.header">
    <div class="container">
      <div :class="styles.wrapper">
        <div :class="styles.logo">
          <NuxtLink to="/">
            <NuxtImg v-if="data.logo?.length" :src="`unsplash${data.logo[0]?.path}`" :alt="data.logo[0]?.title"
              width="400" />
          </NuxtLink>
        </div>

        <ClientOnly>
          <div :class="styles.buttons">

            <GeneralButton :data="{
              link: '/go',
              title: 'Логин',
              target: '_blank',
              rel: 'noopener noreferrer',
            }" />

            <GeneralButtonTwo :data="{
              link: '/go',
              title: 'Регистрация',
              target: '_blank',
              rel: 'noopener noreferrer',
            }" />
          </div>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.logo {
  height: 5rem;
  min-height: 5rem;
  border-radius: 0.25rem;
  overflow: hidden;

  @include media(mobile) {
    height: 3.5rem;
    min-height: 3.5rem;
  }

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

// .nav {
//   @include media(mobile) {
//     display: none;
//   }
// }

// .navList {
//   display: flex;
//   align-items: center;
//   gap: 2rem;
//   list-style: none;
//   margin: 0;
//   overflow: hidden;
// }

// .navItem {
//   a {
//     display: block;
//     font-size: 1rem;
//     font-weight: 500;
//     color: var(--color-white);
//     white-space: nowrap;
//     transition: color 0.3s;

//     &:hover {
//       color: var(--color-01);
//     }

//     &.router-link-active {
//       color: var(--color-01);
//     }
//   }
// }

.buttons {
  display: flex;
  align-items: center;
  gap: 1rem;

  @include media(mobile) {
    display: none;
  }
}
</style>
