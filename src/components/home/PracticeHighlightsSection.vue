<template>
  <section
    class="practice-highlights"
    aria-labelledby="practice-highlights-heading"
  >
    <div :class="containerClass">
      <figure class="practice-highlights__cover">
        <img :src="imageSrc" :alt="imageAlt" loading="lazy" />
        <figcaption class="visually-hidden">{{ imageAlt }}</figcaption>
      </figure>

      <div
        class="practice-highlights__stats"
        role="list"
        aria-label="Key achievements"
      >
        <article v-for="(s, i) in stats" :key="i" class="stat" role="listitem">
          <div class="stat__content">
            <div class="stat__label">
              <p class="stat__value">{{ s.value }}</p>
              <p class="stat__description">{{ s.description }}</p>
            </div>
            <h3 class="stat__category" :id="`practice-highlights-heading-${i}`">
              {{ s.title }}
            </h3>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { mapContainer } from "@/utils/containerClass";
export default {
  name: "PracticeHighlightsSection",
  props: {
    container: { type: String, default: "main" },
    imageSrc: {
      type: String,
      default:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="%23910d0f"/></svg>',
    },
    imageAlt: { type: String, default: "Monochrome placeholder image" },
    stats: {
      type: Array,
      default: () => [
        {
          value: "System",
          description: "Geometric principles meet intuition",
          title: "Method",
        },
        {
          value: "Light",
          description: "Architecture of illumination",
          title: "Innovation",
        },
        {
          value: "Beauty",
          description: "Radical aesthetic choice",
          title: "Vision",
        },
      ],
    },
  },
  computed: {
    containerClass() {
      return mapContainer(this.container);
    },
  },
};
</script>

<style scoped>
.practice-highlights {
  padding-block: var(--spacing-64);
}

.practice-highlights__cover {
  margin: 0 0 var(--spacing-64) 0;
}

.practice-highlights__cover img {
  width: 100%;
  height: clamp(280px, 35vw, 480px);
  object-fit: cover;
  display: block;
  filter: grayscale(0.15);
}

.practice-highlights__stats {
  border-block-start: 1px solid var(--color-border-default);
}

.stat {
  border-block-end: 1px solid var(--color-border-default);
}

.stat__content {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--spacing-48);
  padding-block: var(--spacing-40);
}

.stat__label {
  display: grid;
  grid-template-columns: minmax(auto, 14ch) 1fr;
  align-items: baseline;
  column-gap: var(--spacing-48);
}

.stat__value {
  font-size: clamp(var(--font-size-40), 5.5vw, var(--font-size-60));
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.1;
  font-family: var(--font-heading-light);
  font-weight: var(--font-weight-light);
  font-style: italic;
  /* Prevent word breaking */
  word-break: keep-all;
  hyphens: none;
  overflow-wrap: normal;
}

.stat__description {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-20);
  line-height: var(--line-height-normal);
}

.stat__category {
  margin: 0;
  text-transform: uppercase;
  font-family: var(--font-heading-light);
  font-weight: var(--font-weight-light);
  color: var(--color-text-secondary);
  font-size: clamp(var(--font-size-32), 4vw, var(--font-size-46));
  white-space: nowrap;
}

/* Tablet adaptation: keep layout but adjust spacing */
@media (max-width: 1024px) {
  .stat__content {
    gap: var(--spacing-32);
  }

  .stat__label {
    column-gap: var(--spacing-32);
  }

  .stat__category {
    font-size: var(--font-size-38);
  }
}

/* Mobile landscape: transition to stacked but keep category visible */
@media (max-width: 768px) {
  .practice-highlights {
    padding-block: var(--spacing-48);
  }

  .practice-highlights__cover {
    margin-bottom: var(--spacing-48);
  }

  .practice-highlights__cover img {
    height: clamp(200px, 40vw, 320px);
  }

  .stat__content {
    grid-template-columns: 1fr;
    gap: var(--spacing-20);
    padding-block: var(--spacing-32);
  }

  .stat__label {
    grid-template-columns: 1fr;
    gap: var(--spacing-12);
  }

  .stat__value {
    font-size: var(--font-size-38);
    margin-bottom: var(--spacing-8);
  }

  .stat__description {
    font-size: var(--font-size-18);
    line-height: var(--line-height-relaxed);
  }

  .stat__category {
    font-size: var(--font-size-28);
    color: var(--color-text-secondary);
    text-align: left;
    margin-top: var(--spacing-8);
  }
}

/* Mobile portrait: compact everything */
@media (max-width: 480px) {
  .practice-highlights {
    padding-block: var(--spacing-40);
  }

  .practice-highlights__cover {
    margin-bottom: var(--spacing-40);
  }

  .stat__content {
    padding-block: var(--spacing-24);
  }

  .stat__value {
    font-size: var(--font-size-32);
  }

  .stat__description {
    font-size: var(--font-size-16);
  }

  .stat__category {
    font-size: var(--font-size-24);
  }
}

.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  clip-path: inset(50%);
}
</style>
