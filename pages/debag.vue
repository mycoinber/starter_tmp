<template>
    <div>
      <h1>Debug Page with SWR</h1>
      <p>Last fetched at: {{ timestamp }}</p>
      <p>Data: {{ data }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  // Состояние для данных и времени последнего обновления
  const data = ref(null)
  const timestamp = ref('')
  
  const fetchData = async () => {
    const { data: fetchedData, error } = await useFetch('/api/debug-data')
    if (error.value) {
      console.error(error.value)
    } else {
      data.value = fetchedData
      timestamp.value = new Date().toLocaleTimeString()
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>
  
  <style scoped>
  h1 {
    color: #2c3e50;
  }
  </style>
  