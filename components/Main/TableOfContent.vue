<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

// Флаг, определяющий, открыт ли список
const isOpen = ref(false);

// Функция для переключения состояния списка
const toggle = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <div class="container">
        <nav class="table-of-contents" v-if="data.sections && data.sections.length">
            <div class="table-of-contents__header" @click="toggle">
                <span class="table-of-contents__title">Table of Contents</span>
                <span class="table-of-contents__arrow" :class="{ 'table-of-contents__arrow--open': isOpen }">
                    &#9656;
                </span>
            </div>
            <transition name="dropdown">
                <ul v-show="isOpen" class="table-of-contents__list" itemscope itemtype="https://schema.org/ItemList">
                    <li v-for="(item, index) in data.sections" :key="item.key" class="table-of-contents__item"
                        itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <meta itemprop="position" :content="index + 1" />
                        <a :href="'#' + item.key" itemprop="url" class="table-of-contents__link">
                            <span itemprop="name" class="table-of-contents__link-text">
                                {{ item.headline }}
                            </span>
                        </a>
                    </li>
                </ul>
            </transition>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
.table-of-contents {
    width: fit-content;
    background-color: $color-bg;
    border: 0.063rem solid $color-1;
    padding: 1.25rem;
    border-radius: 0.25rem;
    margin: 2rem 0;
    /* Сбрасываем счётчик для нумерации пунктов */
    counter-reset: toc-counter;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 0.625rem;
    }

    &__title {
        margin: 0;
        font-size: 1.125rem;
        color: $color-1;
    }

    &__arrow {
        display: inline-block;
        transition: transform 0.3s ease;
        font-size: 1.5rem;
        color: $color-1;

        &--open {
            transform: rotate(90deg);
        }
    }

    &__list {
        list-style: none;
        padding: 0.625rem 0;
        margin: 0;
        overflow: hidden;
    }

    &__item {
        /* Нумерация пунктов с помощью CSS-счётчика */
        counter-increment: toc-counter;
        position: relative;
        padding-left: 2rem; // Отступ для вывода номера
        margin-bottom: 0.3125rem; // spacing-xs

        &::before {
            content: counter(toc-counter) ". ";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            color: $color-1;
            font-weight: bold;
        }
    }

    &__link {
        text-decoration: none;
        color: $color-2;
        font-size: 1rem;
        transition: color 0.3s ease;

        &:hover {
            text-decoration: underline;
            color: $color-4;
        }
    }

    &__link-text {
        // Дополнительное оформление текста, если необходимо
    }
}

/* Плавное раскрытие/сжатие списка */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    max-height: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
    opacity: 1;
    max-height: 30rem; // Достаточное значение для полного раскрытия списка
}
</style>