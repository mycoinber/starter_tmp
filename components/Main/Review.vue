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
  <section :id="data.key">
    <div :class="styles.container">
      <div v-if="data.type === 'reviews'" v-html="contentHtml"></div>

      <NuxtImg
        v-if="data.images?.length"
        :src="`unsplash${data.images[0]?.path}`"
        :alt="data.images[0]?.title"
        width="400"
      />
    </div>
  </section>
</template>

<style module lang="scss">
  .container {
    padding: 20px;
    background-color: #f5f5f5;
  }

  .review {
    padding: 15px;
    border: 1px solid #ddd;
    background-color: #fff;
    margin-bottom: 15px;
    border-radius: 5px;
  }

  .reviewAuthor {
    font-weight: bold;
    font-size: 18px;
  }

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
</style>
