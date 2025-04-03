<script setup>
  import { ref } from "vue";
  import { useCssModule } from "vue";
  import { parse } from "node-html-parser";

  const styles = useCssModule();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const activeIndex = ref(0);

  const toggleFAQ = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
  };
</script>

<template>
  <section v-if="data" :id="data._id" :class="styles.block">
    <div class="container">
      <h2>{{ data?.H2 }}</h2>
      <!-- <div v-if="data.content" v-html="data.content" :class="styles.content"></div> -->

      <div :class="styles.list" itemscope itemtype="https://schema.org/FAQPage">
        <div
          v-for="(faq, index) in data.faqs"
          :key="faq._id"
          :class="styles.item"
          itemscope
          itemtype="https://schema.org/Question"
        >
          <h3
            :class="[
              styles.question,
              { [styles.active]: activeIndex === index },
            ]"
            itemprop="name"
            @click="toggleFAQ(index)"
          >
            <span>{{ faq.question }}</span>

            <span :class="styles.arrow">
              <Icon name="fluent:chevron-down-16-filled" />
            </span>
          </h3>

          <div
            :class="[styles.answer, { [styles.active]: activeIndex === index }]"
            itemscope
            itemtype="https://schema.org/Answer"
          >
            <p :class="styles.text" itemprop="text">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
  .block {
    margin: 2rem 0;

    @include media(mobile) {
      margin: 1rem 0 2rem;
    }
  }

  .list {
    display: flex;
    flex-direction: column;
  }

  .item {
    border-bottom: 1px solid #ddd;
  }

  .arrow {
    display: inline-block;
    transition: transform 0.3s;
    font-size: 1.5rem;
  }

  .question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
    transition: color 0.3s ease;

    @include media(mobile) {
      font-size: 1.25rem;
    }

    &:hover {
      color: var(--color-01);
    }

    &.active {
      color: var(--color-01);

      .arrow {
        transform: rotate(180deg);
      }
    }
  }

  .answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    opacity: 0;

    &.active {
      max-height: 25rem;
      opacity: 1;
      padding: 1rem 0;

      @include media(mobile) {
        padding: 0.5rem 0;
      }
    }
  }
</style>
