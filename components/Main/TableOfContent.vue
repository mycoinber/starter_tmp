<script setup>
import { ref, useCssModule } from "vue";
const styles = useCssModule();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <section v-if="data.article?.blocks.length" :class="styles.block">
    <div class="container">
      <nav :class="styles.wrapper">
        <div :class="styles.head" @click="toggle">
          <span :class="styles.title">{{ $t('table_of_content') }}</span>
          <span :class="[styles.arrow, { [styles.active]: isOpen }]">
            <Icon name="fluent:chevron-down-16-filled" />
          </span>
        </div>

        <div :class="[styles.listWrapper, { [styles.active]: isOpen }]">
          <ul :class="styles.list" itemscope itemtype="https://schema.org/ItemList">
            <li v-for="(item, index) in data.article.blocks" :key="item._id" :class="styles.item"
              itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a :href="'#' + item._id" itemprop="url">
                <meta itemprop="position" :content="index + 1" />
                <span itemprop="name" :class="styles.text">{{ item.H2 }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
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

.wrapper {
  width: 100%;
  padding: 1rem;
  border: 0.063rem solid var(--border);
  border-radius: 0.625rem;
  background: var(--background-02);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.title {
  font-size: 1.5rem;
  font-family: var(--font-02);
  text-transform: uppercase;

  @include media(mobile) {
    font-size: 1.25rem;
  }
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 1.5rem;

  &.active {
    transform: rotate(180deg);
  }
}

.listWrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: 0;

  &.active {
    max-height: 25rem;
    opacity: 1;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 1rem 0 0;
  margin: 0;
}

.item {
  color: var(--color-white);
  position: relative;
  padding-left: 2rem;
  transition: all 0.3s;
  counter-increment: toc-counter;
  opacity: 0.5;
  font-size: 0.875rem;
  margin: 0;

  &::before {
    content: counter(toc-counter) ". ";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &:hover {
    color: var(--color-01);
    opacity: 1;
  }

  a {
    color: inherit;
    font-size: inherit;
  }
}
</style>
