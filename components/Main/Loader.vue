<template>
    <div class="loader"></div>
</template>

<style scoped>
.loader {
    width: 3rem;
    height: 3rem;
    border: 0.313rem solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--color-01);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>