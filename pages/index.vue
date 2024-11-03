<template>
  <div>
    <!-- Header -->
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/">Главная</NuxtLink></li>
          <li><NuxtLink to="/auto-insurance">Автострахование</NuxtLink></li>
          <li>
            <NuxtLink to="/health-insurance">Медицинское страхование</NuxtLink>
          </li>
          <li><NuxtLink to="/life-insurance">Страхование жизни</NuxtLink></li>
          <li><NuxtLink to="/contact">Контакты</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li><NuxtLink to="/">Главная</NuxtLink> &gt;</li>
        <li>Страхование</li>
      </ol>
    </nav>

    <main>
      <!-- Навигация по статье -->
      <aside>
        <nav aria-label="Table of Contents">
          <ul>
            <li><a href="#benefits">Преимущества страхования</a></li>
            <li><a href="#types">Типы страховых полисов</a></li>
            <li><a href="#faq">Часто задаваемые вопросы</a></li>
          </ul>
        </nav>
      </aside>

      <!-- Article Content -->
      <article>
        <h1>Руководство по Страхованию</h1>

        <!-- Главное изображение -->
        <figure>
          <NuxtImg
            src="/test.jpg"
            alt="Описание изображения"
            width="150"
            height="150"
            format="webp"
          />

          <figcaption>Это подпись к изображению</figcaption>
        </figure>

        <p>
          Страхование — это система защиты от финансовых рисков, которую
          предоставляет страховая компания. В этой статье мы рассмотрим ключевые
          виды страхования и их преимущества.
        </p>

        <section id="benefits">
          <h2>Преимущества страхования</h2>
          <p>
            Страхование позволяет минимизировать финансовые риски, будь то на
            случай аварий, болезней или потери имущества.
          </p>

          <!-- Вспомогательное изображение -->
          <figure>
            <img src="" alt="Пример страховки для защиты семьи" />
            <figcaption>
              Страхование может защитить вас и вашу семью от неожиданных
              финансовых рисков.
            </figcaption>
          </figure>
        </section>

        <section id="types">
          <h2>Типы страховых полисов</h2>
          <h3>Автострахование</h3>
          <p>
            Автострахование защищает водителей и пассажиров от финансовых потерь
            в случае аварий или угона.
          </p>
          <h3>Медицинское страхование</h3>
          <p>
            Медицинское страхование помогает покрыть расходы на лечение и
            профилактику заболеваний.
          </p>
          <h3>Страхование жизни</h3>
          <p>
            Этот вид страхования предоставляет финансовую поддержку семье в
            случае смерти страхователя.
          </p>
        </section>

        <section id="faq">
          <h2>Часто задаваемые вопросы (FAQ)</h2>
          <h3>Какой вид страхования мне выбрать?</h3>
          <p>
            Выбор зависит от ваших потребностей. Например, для владельцев
            автомобилей важно автострахование, а для семейных — страхование
            жизни.
          </p>
          <h3>Как рассчитать стоимость страхования?</h3>
          <p>
            Стоимость зависит от многих факторов: возраст, состояние здоровья,
            стоимость имущества и другие.
          </p>
        </section>
      </article>
    </main>

    <footer>
      <p>&copy; 2024 Страхование Путеводитель. Все права защищены.</p>
    </footer>
  </div>
</template>

<script setup>
  useHead({
    title: "Страхование - Путеводитель",
    meta: [
      {
        name: "description",
        content:
          "Полное руководство по выбору страхования, включая советы, преимущества и виды страховых полисов.",
      },
      {
        name: "keywords",
        content:
          "страхование, страховой полис, автострахование, страхование здоровья, страхование жизни",
      },
    ],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://example.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Страхование",
              item: "https://example.com/insurance",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Какой вид страхования мне выбрать?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Выбор зависит от ваших потребностей. Например, для владельцев автомобилей важно автострахование, а для семейных — страхование жизни.",
              },
            },
            {
              "@type": "Question",
              name: "Как рассчитать стоимость страхования?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Стоимость зависит от многих факторов: возраст, состояние здоровья, стоимость имущества и другие.",
              },
            },
          ],
        }),
      },
    ],
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
