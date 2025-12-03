<template>
  <section aria-labelledby="series-overview-heading" class="series-overview">
    <div :class="[containerClass, 'series-overview__inner']">
      <h2 id="series-overview-heading" class="visually-hidden">
        {{ srHeading }}
      </h2>
      <div class="series-overview__list">
        <article
          v-for="(item, index) in items"
          :key="index"
          class="series-card"
        >
          <figure class="series-card__media">
            <img :src="item.image" :alt="item.alt" loading="lazy" />
            <figcaption class="visually-hidden">{{ item.alt }}</figcaption>
          </figure>

          <div class="series-card__content">
            <h3 class="series-card__title">{{ item.title }}</h3>
            <p v-if="metaLine(item)" class="series-card__meta">
              {{ metaLine(item) }}
            </p>
            <p v-if="item.description" class="series-card__description">
              {{ item.description }}
            </p>
            <div v-if="item.href || item.to" class="series-card__actions">
              <ButtonComponent
                :tag="item.to ? 'router-link' : 'a'"
                :to="item.to"
                :href="item.href"
                variant="primary"
                size="medium"
                :aria-label="`View details for ${item.title}`"
              >
                {{ item.buttonLabel || "See project details" }}
              </ButtonComponent>
              <ButtonComponent
                tag="button"
                variant="secondary"
                size="medium"
                :aria-label="`Download ${item.title} catalog PDF`"
                @click="$emit('download-catalog', item)"
              >
                Download catalog (PDF)
              </ButtonComponent>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import { mapContainer } from "@/utils/containerClass";

export default {
  name: "SeriesOverviewSection",
  emits: ["download-catalog"],
  props: {
    container: { type: String, default: "wide" },
    srHeading: {
      type: String,
      default: "Projects overview",
    },
    items: {
      type: Array,
      default: () => [
        {
          image:
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23910d0f"/></svg>',
          alt: "Detail from Architecture of Light project",
          title: "Architecture of Light",
          dimensions: "Large canvases · 140–180 cm height",
          startYear: 2024,
          endYear: null,
          medium: "Oil and acrylic on canvas",
          description:
            "Harmonic grids meet veils of light; decisive impasto passages redirect perception across layered color fields.",
          href: "#",
          buttonLabel: "Open full project",
        },
        {
          image:
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23910d0f"/></svg>',
          alt: "Detail from Resonant Fields project",
          title: "Resonant Fields",
          dimensions: "Panels · 60–90 cm width",
          startYear: 2022,
          endYear: null,
          medium: "Pigment and wax on panel",
          description:
            "Chromatic matrices built from glazes and scored marks; surface tension holds suspended rhythm and depth.",
          href: "#",
          buttonLabel: "See project details",
        },
      ],
    },
  },
  components: {
    ButtonComponent,
  },
  computed: {
    containerClass() {
      return mapContainer(this.container);
    },
  },
  methods: {
    metaLine(item) {
      if (Array.isArray(item.metadata) && item.metadata.length) {
        return item.metadata
          .map((meta) => {
            if (meta.value) return meta.value;
            return [meta.label, meta.value].filter(Boolean).join(": ");
          })
          .filter(Boolean)
          .join(", ");
      }
      const meta = [];
      if (this.hasYears(item)) {
        meta.push(this.formatYears(item));
      }
      if (item.medium) {
        meta.push(item.medium);
      }
      if (item.dimensions) {
        meta.push(item.dimensions);
      }
      return meta.join(", ");
    },
    hasYears(item) {
      return Boolean(item.startYear || item.endYear);
    },
    formatYears(item) {
      if (!item.startYear && !item.endYear) return "";
      if (item.startYear && item.endYear)
        return `${item.startYear}—${item.endYear}`;
      if (item.startYear && !item.endYear) return `${item.startYear}—present`;
      return `${item.endYear}`;
    },
  },
};
</script>

<style scoped>
/* ==========================================================================
   Utility Classes
   ========================================================================== */
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  clip-path: inset(50%);
}

/* ==========================================================================
   Series Overview Section
   ========================================================================== */
.series-overview {
  padding-block: var(--spacing-96);
  background: var(--color-surface-primary);
}

.series-overview__inner {
  display: flex;
  flex-direction: column;
}

.series-overview__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-96);
}

/* ==========================================================================
   Series Card - Two Column Layout
   ========================================================================== */
.series-card {
  display: grid;
  gap: var(--spacing-96);
  align-items: center;
}

/* First series: image on left (smaller), content on right (larger) */
.series-card:nth-child(odd) {
  grid-template-columns: 1fr 1.5fr;
}

.series-card:nth-child(odd) .series-card__media {
  order: 1;
}

.series-card:nth-child(odd) .series-card__content {
  order: 2;
}

/* Second series: content on left (larger), image on right (smaller) */
.series-card:nth-child(even) {
  grid-template-columns: 1.5fr 1fr;
}

.series-card:nth-child(even) .series-card__media {
  order: 2;
}

.series-card:nth-child(even) .series-card__content {
  order: 1;
}

.series-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
}

.series-card__meta {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.series-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-48);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.series-card__description {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
}

.series-card__actions {
  margin-top: var(--spacing-8);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-16);
}

/* ==========================================================================
   Media Figure
   ========================================================================== */
.series-card__media {
  margin: 0;
  position: relative;
  width: 100%;
}

.series-card__media img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--color-surface-secondary);
}

/* ==========================================================================
   Responsive Design
   ========================================================================== */
@media (max-width: 1024px) {
  .series-overview {
    padding-block: var(--spacing-64);
  }

  .series-overview__list {
    gap: var(--spacing-64);
  }

  .series-card {
    gap: var(--spacing-48);
  }

  .series-card__title {
    font-size: var(--font-size-38);
  }
}

@media (max-width: 768px) {
  .series-overview {
    padding-block: var(--spacing-48);
  }

  .series-overview__list {
    gap: var(--spacing-48);
  }

  .series-card,
  .series-card:nth-child(odd),
  .series-card:nth-child(even) {
    grid-template-columns: 1fr;
    gap: var(--spacing-32);
  }

  /* Reset order: image always on top, content always below on mobile */
  .series-card__media,
  .series-card:nth-child(odd) .series-card__media,
  .series-card:nth-child(even) .series-card__media {
    order: 1;
  }

  .series-card__content,
  .series-card:nth-child(odd) .series-card__content,
  .series-card:nth-child(even) .series-card__content {
    order: 2;
    gap: var(--spacing-20);
  }

  .series-card__title {
    font-size: var(--font-size-32);
  }

  .series-card__description {
    font-size: var(--font-size-16);
  }

  .series-card__actions {
    display: flex;
    justify-content: center;
  }

  .series-card__media img {
    aspect-ratio: 4 / 5;
  }
}

@media (max-width: 640px) {
  .series-card__meta {
    font-size: var(--font-size-16);
  }

  .series-card__title {
    font-size: var(--font-size-28);
  }
}

/* ==========================================================================
   Accessibility
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .series-card {
    border: 1px solid ButtonText;
  }
}
</style>
