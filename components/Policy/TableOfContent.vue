<script setup>
import { ref, useCssModule } from 'vue';
const styles = useCssModule();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const isOpen = ref(false);

function toggle() {
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <section v-if="data.sections?.length" :class="styles.block">
        <div class="container">
            <nav :class="styles.wrapper">
                <div :class="styles.head" @click="toggle">
                    <span :class="styles.title">Table of Contents</span>

                    <span :class="styles.arrow">
                        <Icon name="fluent:chevron-down-16-filled" />
                    </span>
                </div>

                <transition name="dropdown">
                    <ul v-show="isOpen" :class="styles.list" itemscope itemtype="https://schema.org/ItemList">
                        <li v-for="(item, index) in data.sections" :key="item.key" :class="styles.item"
                            itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

                            <a :href="'#' + item.key" itemprop="url" :class="styles.link">
                                <meta itemprop="position" :content="index + 1" />

                                <span itemprop="name" :class="styles.text">{{ item.headline }}</span>
                            </a>
                        </li>
                    </ul>
                </transition>
            </nav>
        </div>
    </section>
</template>

<style lang="scss" scoped module>
.block {
    margin: 2rem 0;

    @include media(mobile) {
        margin: 1rem 0;
    }
}

.wrapper {
    width: 100%;
    padding: 1rem;
    border: 0.063rem solid var(--border);
    border-radius: 0.625rem;
    counter-reset: toc-counter;
    background: var(--background-02);
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
}

.title {
    font-size: 1.5rem;
    font-family: var(--font-02);
    text-transform: uppercase;
    margin: 0;
    padding: 0;
}

.arrow {
    display: inline-block;
    transition: transform 0.3s;
    font-size: 1.5rem;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
    padding: 1rem 0 0;
    margin: 0;
}

.link {
    color: var(--color-white);
    position: relative;
    padding-left: 2rem;
    transition: color 0.3s;
    counter-increment: toc-counter;

    &::before {
        content: counter(toc-counter) ". ";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    &:hover {
        color: var(--color-01);
    }
}
</style>