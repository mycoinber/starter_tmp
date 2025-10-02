<script setup>
import { useCssModule } from "vue";
import { computed } from 'vue';
const styles = useCssModule();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

// Prefer offer.link (via composable) if offerId is provided or available globally, fallback to provided link
const explicitOfferId = computed(() => props.data?.offerId || props.data?.offer?._id)
const globalOfferId = useState('currentOfferId', () => null)
const offerId = computed(() => explicitOfferId.value || globalOfferId.value)
const { offer } = useOffer(offerId)
// If explicit link is provided, respect it; otherwise use offer.link when available
const resolvedLink = computed(() => props.data?.link ? props.data.link : (offer.value?.link || ''))
</script>

<template>
    <NuxtLink v-if="resolvedLink" :to="resolvedLink" :class="styles.button" :target="data.target || '_self'" :rel="data.rel || ''">
        {{ data.title }}
    </NuxtLink>
    <button v-else type="button" :class="styles.button">
        {{ data.title }}
    </button>
    
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
