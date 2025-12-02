<template>
  <section class="layout-content artist-statement">
    <!-- Content -->
    <div class="artist-statement__content">
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="artist-statement__paragraph"
      >
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArtistStatementSection',
  props: {
    paragraphs: {
      type: Array,
      default: () => [
        'I believe that boundaries exist only in our minds. Art is a universal language that transcends geography and prejudice.',
        'Flowers and light are the alphabet of my practice; choosing beauty over provocation is a deliberate act.',
        'Through watercolor, oil, and acrylic I work across transparency, volume, and rhythm to express what words cannot.'
      ]
    }
  }
}
</script>

<style scoped>
/* ==========================================================================
   ARTIST STATEMENT SECTION
   ========================================================================== */
.artist-statement {
  padding-top: var(--spacing-96); /* 96px */
  padding-bottom: var(--spacing-96); /* 96px */
}

/* ==========================================================================
   CONTENT AREA
   ========================================================================== */
.artist-statement__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-32); /* 32px между параграфами - меньше как в оригинале */
}

/* ==========================================================================
   PARAGRAPHS - Optimal Reading Typography
   ========================================================================== */
.artist-statement__paragraph {
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 18px desktop, 16px mobile */
  font-weight: var(--font-weight-regular); /* 400 */
  line-height: var(--line-height-normal); /* 1.6 как обычно */
  color: var(--color-text-primary);
  margin: 0;
  max-width: none; /* Полная ширина контейнера */
}

/* Убираем выделение финального параграфа */

/* ==========================================================================
   RESPONSIVE DESIGN
   ========================================================================== */

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
  .artist-statement__container {}

  .artist-statement__content {
    gap: var(--spacing-20); /* 24px на tablet */
  }

}

/* Mobile (max-width: 767px) */
@media (max-width: 767px) {
  .artist-statement {
    padding-top: var(--spacing-64); /* 64px */
    padding-bottom: var(--spacing-64); /* 64px */
  }

  .artist-statement__container {}

  .artist-statement__content {
    gap: var(--spacing-20); /* 24px между параграфами */
  }

  .artist-statement__paragraph {
    text-align: left; /* На мобильном убираем justify */
  }

}

/* Small Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .artist-statement__container {}

}

/* Large Screens (1280px+) */
@media (min-width: 1280px) {
  .artist-statement {
    padding-top: calc(var(--spacing-96) * 1.5); /* 144px */
    padding-bottom: calc(var(--spacing-96) * 1.5); /* 144px */
  }

  .artist-statement__container {
    padding-left: var(--spacing-96); /* 96px */
    padding-right: var(--spacing-96); /* 96px */
  }

  .artist-statement__content {
    gap: var(--spacing-32); /* 32px для больших экранов */
  }

}
</style>
