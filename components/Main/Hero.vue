<script setup>
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<template>
  <div>
    <h1>{{ data.h1 }}</h1>
  </div>
</template>
