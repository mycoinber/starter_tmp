<template>
  <div>
    <MainHero v-if="data.sections && data.sections.length" :data="data" />
    <nav class="table-of-contents" v-if="data.sections && data.sections.length">
      <ul itemscope itemtype="https://schema.org/ItemList">
        <li
          v-for="(item, index) in data.sections"
          :key="item.key"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <meta itemprop="position" :content="index + 1" />
          <a :href="'#' + item.key" itemprop="url">
            <span itemprop="name">{{ item.headline }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <MainSection
      v-if="data.sections && data.sections.length > 1"
      v-for="(item, index) in data.sections.slice(1)"
      :key="index"
      :data="item"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<style scoped>
  body {
    font-family: Arial, sans-serif;
  }
  header nav ul {
    list-style-type: none;
    padding: 0;
  }
  header nav ul li {
    display: inline;
    margin-right: 10px;
  }
  .breadcrumb {
    font-size: 14px;
  }
  figure {
    margin: 1em 0;
  }
  figcaption {
    font-size: 0.9em;
    color: #666;
  }
</style>
