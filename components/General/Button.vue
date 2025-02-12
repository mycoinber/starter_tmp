<script setup>
import { useCssModule } from "vue";
const styles = useCssModule();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
</script>

<template>
    <NuxtLink :to="data.link" :class="styles.button" :target="data.target || '_self'" :rel="data.rel || ''">
        {{ data.title }}
    </NuxtLink>
</template>

<style lang="scss" scoped module>
.button {
    font-family: var(--font-02);
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-white);
    text-align: center;
    text-transform: uppercase;
    width: fit-content;
    min-width: 8rem;
    padding: 1rem 1.5rem;
    border-radius: 0.4rem;
    position: relative;
    z-index: 1;
    overflow: hidden;

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-01);
        z-index: -1;
        transition: filter 0.3s;
    }

    &:hover {
        &::before {
            filter: brightness(0.7);
        }
    }
}
</style>