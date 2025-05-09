<script setup>
import { ref, useSSRContext, onMounted, useCssModule } from "vue";
import { parse } from "node-html-parser";

const styles = useCssModule();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const ssrContext = import.meta.server ? useSSRContext() : null;
const contentHtml = ref("");

const parseHTML = (html) => {
  if (import.meta.server) {
    return parse(html);
  } else {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }
};

const processHtmlContent = (htmlString) => {
  const doc = parseHTML(htmlString);

  const addClasses = (selector, styleClass) => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach((el) => {
      if (import.meta.server) {
        const classAttr = el.getAttribute("class") || "";
        el.setAttribute("class", `${classAttr} ${styles[styleClass]}`);
      } else {
        el.classList.add(styles[styleClass]);
      }
    });
  };

  addClasses('[itemtype="https://schema.org/FAQPage"]', "faqPage");
  addClasses('[itemtype="https://schema.org/Question"]', "faqQuestion");
  addClasses('[itemtype="https://schema.org/Answer"]', "faqAnswer");
  addClasses('[itemprop="text"]', "faqAnswertext");

  return import.meta.server ? doc.toString() : doc.body.innerHTML;
};

if (import.meta.server && props.data.type === "section") {
  const modifiedHtml = processHtmlContent(props.data.content);
  ssrContext.modifiedHtml = modifiedHtml;
  contentHtml.value = modifiedHtml;
}

onMounted(() => {
  if (props.data.type === "section") {
    contentHtml.value =
      ssrContext?.modifiedHtml || processHtmlContent(props.data.content);
  }
});
</script>

<template>
  <section :id="data.key" :class="styles.block">
    <div class="container">
      <div :class="styles.wrapper">
        <div v-if="data.type === 'section'" v-html="contentHtml" :class="styles.content"></div>

        <div v-if="data.images?.length" :class="styles.img">
          <NuxtImg :src="`unsplash${data.images[0]?.path}`" :alt="data.images[0]?.alt || 'image'" width="400" />
        </div>
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

.wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  width: 100%;

  @include media(mobile) {
    flex-direction: column;
  }
}

.content {
  flex: 1;
}

.img {
  flex: 1;
  border-radius: 0.625rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

a {
  color: var(--color-01);
}
</style>
