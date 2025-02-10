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

    addClasses("table", "styledTable");
    addClasses("th", "tableHeader");
    addClasses("td", "tableCell");

    return import.meta.server ? doc.toString() : doc.body.innerHTML;
  };

  if (import.meta.server && props.data.type === "table") {
    const modifiedHtml = processHtmlContent(props.data.content);
    ssrContext.modifiedHtml = modifiedHtml;
    contentHtml.value = modifiedHtml;
  }

  onMounted(() => {
    if (props.data.type === "table") {
      contentHtml.value =
        ssrContext?.modifiedHtml || processHtmlContent(props.data.content);
    }
  });
</script>

<template>
  <section :id="data.key">
    <div :class="styles.container">
      <div v-if="data.type === 'table'" v-html="contentHtml"></div>
    </div>
    <NuxtImg
      v-if="data.images?.length"
      :src="`unsplash${data.images[0]?.path}`"
      :alt="data.images[0]?.title"
      width="400"
    />
  </section>
</template>

<style module lang="scss">
  .container {
    padding: 20px;
    background-color: #f5f5f5;
  }

  .styledTable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .tableHeader {
    background-color: #007bff;
    color: white;
    padding: 10px;
    text-align: left;
  }

  .tableCell {
    border: 1px solid #ddd;
    padding: 8px;
  }
</style>
