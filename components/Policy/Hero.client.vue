<script setup>
import { useCssModule } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const config = useRuntimeConfig();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const backHost = import.meta.server
  ? config.server.backHost
  : config.public.backHost;

const styles = useCssModule();
const { $axios } = useNuxtApp();

const fetchOffer = async () => {
  const response = await $axios.get(`/offer/public/${props.data.offer}`);
  return response.data;
};

const {
  data: offer,
  isPending,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: computed(() => ["offers", props.data.offer]),
  queryFn: fetchOffer,
});

watch(
  offer,
  (newData) => {
  },
  { immediate: true }
);
</script>

<template>
  <section v-if="offer" :class="styles.block">
    <div class="container">
      <div :class="styles.wrapper">
        <div :class="styles.content">
          <div :class="styles.contentHead">
            <span :class="styles.title">{{ offer.label }}</span>

            <div :class="styles.contentBlock">
              <span :class="styles.span">{{ offer.title }}</span>

              <GeneralButton :data="{
                link: offer.link || '',
                title: offer.button1 || t('play'),
                target: '_blank',
                rel: 'noopener noreferrer',
              }" :class="styles.contentButton" />
            </div>
          </div>

          <div :class="styles.contentMain">
            <div :class="styles.contentImg">
              <img :src="backHost + offer.mainImage[0].path" provider="none" />
            </div>

            <GeneralButtonThree :data="{
              link: offer.link || '',
              title: offer.button2 || t('play'),
              target: '_blank',
              rel: 'noopener noreferrer',
            }" style="width: 25%" />
          </div>
        </div>

        <div :class="styles.offers">
          <div :class="styles.offer">
            <div :class="styles.offerImg">
              <NuxtImg src="/bg.png" />
            </div>

            <span :class="styles.offerTitle">Приветственный Бонус +120% от 1000$</span>

            <div :class="styles.offerContent">
              <span :class="styles.offerBonus">Приветственный Бонус +120% от 1000 USDT</span>

              <GeneralButton :data="{
                link: '/go',
                title: t('bonus'),
                target: '_blank',
                rel: 'noopener noreferrer',
              }" style="width: 100%" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">{{ $t('terms_apply') }}</span>

                <span :class="styles.offerSpan">{{ $t('play_responsibility') }}</span>
              </div>
            </div>
          </div>

          <div :class="styles.offer">
            <div :class="styles.offerImg">
              <NuxtImg src="/bg.png" />
            </div>

            <span :class="styles.offerTitle">Приветственный Бонус +120% от 1000$</span>

            <div :class="styles.offerContent">
              <span :class="styles.offerBonus">Приветственный Бонус +120% от 1000 USDT</span>

              <GeneralButton :data="{
                link: '/go',
                title: t('bonus'),
                target: '_blank',
                rel: 'noopener noreferrer',
              }" style="width: 100%" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">{{ $t('terms_apply') }}</span>

                <span :class="styles.offerSpan">{{ $t('play_responsibility') }}</span>
              </div>
            </div>
          </div>

          <div :class="styles.offer">
            <div :class="styles.offerImg">
              <NuxtImg src="/bg.png" alt="Приветственный Бонус +120% от 1000$" />
            </div>

            <span :class="styles.offerTitle">Приветственный Бонус +120% от 1000$</span>

            <div :class="styles.offerContent">
              <span :class="styles.offerBonus">Приветственный Бонус +120% от 1000 USDT</span>

              <GeneralButton :data="{
                link: '/go',
                title: t('bonus'),
                target: '_blank',
                rel: 'noopener noreferrer',
              }" style="width: 100%" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">{{ $t('terms_apply') }}</span>

                <span :class="styles.offerSpan">{{ $t('play_responsibility') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="styles.img">
        <img :src="backHost + offer.background[0].path" alt="Bonus" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped module>
.block {
  width: 100%;
  height: 65rem;
  position: relative;
  z-index: 2;
  margin-bottom: 4rem;

  @include media(mobile) {
    height: fit-content;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    z-index: -1;
    background: linear-gradient(to bottom,
        rgba(255, 255, 255, 0),
        var(--background-01));
    pointer-events: none;
  }
}

.wrapper {
  display: grid;
  grid-template-columns: 75% 25%;
  gap: 2rem;

  @include media(mobile) {
    display: flex;
    flex-direction: column;
  }
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @include media(mobile) {
      object-fit: contain;
      object-position: top center;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 0.063rem solid var(--border);
  border-radius: 0.625rem;
  background: var(--background-02);
}

.contentHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.contentMain {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40rem;
  position: relative;
  border-radius: 0.625rem;
  overflow: hidden;

  @include media(mobile) {
    height: 20rem;
  }
}

.contentBlock {
  display: flex;
  align-items: center;
  gap: 1rem;

  @include media(mobile) {
    display: none;
  }
}

.contentImg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  font-family: var(--font-02);
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
  padding: 0;

  @include media(mobile) {
    font-size: 1.25rem;
    margin: 0 auto;
    text-align: center;
  }
}

.span {
  font-size: 0.875rem;
  opacity: 0.5;
}

.offers {
  display: flex;
  flex-direction: column;
  gap: 2.35rem;
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  position: relative;
  border: 0.063rem solid var(--border);
  border-radius: 0.625rem;
  background: var(--background-02);
}

.offerImg {
  position: absolute;
  left: -1rem;
  top: -1rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 0.063rem solid var(--border);
  overflow: hidden;

  @include media(mobile) {
    left: -0.5rem;
    top: -0.5rem;
    width: 3rem;
    height: 3rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.offerContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.offerTitle {
  font-family: var(--font-02);
  font-size: 1.125rem;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.offerBonus {
  font-family: var(--font-02);
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 120%;
  color: var(--color-03);
  text-align: center;
  text-transform: uppercase;
  padding-top: 1rem;
  border-top: 0.063rem solid var(--border);
}

.offerDesc {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.offerSpan {
  font-size: 0.875rem;
  opacity: 0.5;
  padding-right: 0.5rem;
  border-right: 0.125rem solid var(--border);

  &:last-child {
    border-right: none;
  }
}
</style>
