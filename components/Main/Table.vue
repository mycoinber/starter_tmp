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

    // Функция для добавления классов к элементам
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

    // Оборачиваем таблицу в дополнительный div
    const table = doc.querySelector("table");
    if (table) {
      if (import.meta.server) {
        // Серверный рендеринг: оборачиваем таблицу с помощью строковой модификации
        const wrapperHtml = `<div class="${
          styles.tableWrapper
        }">${table.toString()}</div>`;
        table.replaceWith(parse(wrapperHtml));
      } else {
        // Клиентский рендеринг: создаем DOM-элемент
        const wrapper = document.createElement("div");
        wrapper.className = styles.tableWrapper;
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    }

    // Добавляем классы к таблице и её элементам
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
  <section :id="data.key" v-if="data.type === 'table'" :class="styles.block">
    <div class="container">
      <div v-html="contentHtml" :class="styles.wrapper"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
  .block {
    margin: 2rem 0;
  }

  .wrapper {
    overflow: hidden;
  }
</style>
