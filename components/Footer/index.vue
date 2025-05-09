<script setup>
import { useCssModule } from "vue";
import { useRequestURL } from "#app";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const styles = useCssModule();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const navigationLinks = computed(() => {
  return props.data?.pages
    .map((page) => {
      let title = page.head.title;
      if (title.match(/[-–:|]/)) {
        title = title.split(/[-–:|]/)[0].trim();
      }

      return {
        name: page.homePage ? t('home') : title,
        slug: page.homePage ? "" : page.slug,
      };
    })
    .sort((a, b) => {
      if (a.name === t('home')) return -1;
      if (b.name === t('home')) return 1;
      return 0;
    });
});

const url = useRequestURL();
const siteDomain = `${url.protocol}//${url.host}`;
</script>

<template>
  <footer :class="styles.footer">
    <div class="container">
      <div :class="styles.wrapper">
        <div :class="styles.content">
          <div :class="styles.logo">
            <NuxtLink to="/">
              <NuxtImg v-if="data.logo?.length" :src="`unsplash${data.logo[0]?.path}`"
                :alt="data.logo[0]?.alt || 'logo'" quality="25" loading="lazy" />
            </NuxtLink>
          </div>

          <nav :class="styles.nav">
            <ul :class="styles.navList">
              <li v-for="(link, index) in navigationLinks" :key="index" :class="styles.navItem">
                <NuxtLink :to="`/${link.slug}`" external>{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div :class="styles.copy">
          &#169; Copyright 2025. {{ siteDomain }}
        </div>
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
    padding: 1rem 0;
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
  font-size: 1rem;

  @include media(mobile) {
    font-size: 0.875rem;
  }
}

.logo {
  min-width: 3rem;
  height: 3rem;
  min-height: 3rem;
  border-radius: 0.25rem;
  overflow: hidden;

  @include media(mobile) {
    min-width: 2rem;
    height: 2rem;
    min-height: 2rem;
    margin-bottom: 1rem;
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
      font-size: 0.875rem;
    }

    &:hover {
      color: var(--color-01);
    }
  }
}
</style>
