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
  <section :id="data.sections?.[0]?.key" :class="styles.block">
    <div class="container">
      <div :class="styles.wrapper">

        <div :class="styles.content">
          <div :class="styles.contentHead">
            <h1 :class="styles.title">
              Заголовок H1
            </h1>

            <div class="row">
              <span :class="styles.span">Игра только 18+!</span>

              <GeneralButton
                :data="{ link: '/go', title: 'Играть на деньги', target: '_blank', rel: 'noopener noreferrer' }" />
            </div>
          </div>

          <div :class="styles.contentMain">
            <div :class="styles.contentImg">
              <NuxtImg src="/hero.png" />
            </div>

            <GeneralButtonThree :data="{ link: '/go', title: 'Играть', target: '_blank', rel: 'noopener noreferrer' }"
              style="width: 25%;" />
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

              <GeneralButton :data="{ link: '/go', title: 'Бонус', target: '_blank', rel: 'noopener noreferrer' }"
                style="width: 100%;" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">Terms Apply</span>

                <span :class="styles.offerSpan">Play Responsibility</span>
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

              <GeneralButton :data="{ link: '/go', title: 'Бонус', target: '_blank', rel: 'noopener noreferrer' }"
                style="width: 100%;" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">Terms Apply</span>

                <span :class="styles.offerSpan">Play Responsibility</span>
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

              <GeneralButton :data="{ link: '/go', title: 'Бонус', target: '_blank', rel: 'noopener noreferrer' }"
                style="width: 100%;" />

              <div :class="styles.offerDesc">
                <span :class="styles.offerSpan">18+</span>

                <span :class="styles.offerSpan">Terms Apply</span>

                <span :class="styles.offerSpan">Play Responsibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="styles.img">
        <NuxtImg src="/bg.png" />
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

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--background-01));
    pointer-events: none;

  }
}

.wrapper {
  display: grid;
  grid-template-columns: 75% 25%;
  gap: 2rem;
  padding-top: 8rem;
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
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
  padding: 0;
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
