<script setup>
  import { ref, useSSRContext, onMounted, useCssModule } from "vue";
  // Получаем объект со стилями, определёнными в данном компоненте
  const styles = useCssModule();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const ssrContext = import.meta.server ? useSSRContext() : null;
  const contentHtml = ref("");

  // Универсальная функция парсинга HTML
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

    addClasses('[itemtype="https://schema.org/FAQPage"]', "faqPage");
    addClasses('[itemtype="https://schema.org/Question"]', "faqQuestion");
    addClasses('[itemtype="https://schema.org/Answer"]', "faqAnswer");
    addClasses('[itemprop="text"]', "faqAnswertext");

    return import.meta.server ? doc.toString() : doc.body.innerHTML;
  };

  // Серверный рендеринг
  if (import.meta.server && props.data.type === "faq") {
    const modifiedHtml = processHtmlContent(props.data.content);
    ssrContext.modifiedHtml = modifiedHtml;
    contentHtml.value = modifiedHtml;
  }

  // Клиентская гидратация
  onMounted(() => {
    if (props.data.type === "faq") {
      contentHtml.value =
        ssrContext?.modifiedHtml || processHtmlContent(props.data.content);
    }
  });
</script>

<template>
  <section :id="data.key">
    <div :class="styles.container">
      <div v-if="data.type === 'faq'" v-html="contentHtml"></div>

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
    // Пример стилей для контейнера компонента
    padding: 20px;
    background-color: #f5f5f5;
  }
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
