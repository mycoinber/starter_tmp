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
  <section :id="data.key" :class="styles.block" v-if="data.type === 'faq'">
    <div class="container">
      <div :class="styles.faqPage" itemscope itemtype="https://schema.org/FAQPage">
        <div v-for="faq in data.faqs" :key="faq.question" :class="styles.faqQuestion" itemscope
          itemtype="https://schema.org/Question">

          <h3 itemprop="name">{{ faq.question }}</h3>

          <div :class="styles.faqAnswer" itemscope itemtype="https://schema.org/Answer">
            <p :class="styles.faqAnswertext" itemprop="text">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
.faqPage {
  padding: 20px;
  background-color: #da1d1d;

  h2 {
    font-size: 40px;
  }

  .faqQuestion {
    margin-bottom: 20px;
    border-bottom: 1px solid #1ec534;
    padding-bottom: 10px;

    h3 {
      font-size: 15px;
    }
  }

  .faqAnswer {
    margin-left: 20px;

    .faqAnswertext {
      font-size: 15px;
    }
  }
}
</style>
