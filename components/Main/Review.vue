<script setup>
import { ref, useSSRContext, onMounted, useCssModule } from "vue";
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
    const { parse } = require("node-html-parser");
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

  addClasses('[itemtype="https://schema.org/Review"]', "review");
  addClasses('[itemprop="author"]', "reviewAuthor");
  addClasses('[itemprop="datePublished"]', "reviewDate");
  addClasses('[itemprop="reviewRating"]', "reviewRating");
  addClasses('[itemprop="reviewBody"]', "reviewBody");

  return import.meta.server ? doc.toString() : doc.body.innerHTML;
};

if (import.meta.server && props.data.type === "reviews") {
  const modifiedHtml = processHtmlContent(props.data.content);
  ssrContext.modifiedHtml = modifiedHtml;
  contentHtml.value = modifiedHtml;
}

onMounted(() => {
  if (props.data.type === "reviews") {
    contentHtml.value =
      ssrContext?.modifiedHtml || processHtmlContent(props.data.content);
  }
});
</script>

<template>
  <section :id="data.key" :class="styles.block" v-if="data.type === 'reviews'">
    <div class="container">
      <div v-html="contentHtml">
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
.reviewAuthor {}

.reviewDate {
  font-size: 14px;
  color: #666;
}

.reviewRating {
  font-size: 16px;
  color: #ff9800;
}

.reviewBody {
  font-size: 16px;
  margin-top: 10px;
}

.reviews {
  display: flex;
  gap: 2rem;
}
</style>
