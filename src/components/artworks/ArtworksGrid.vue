<template>
  <section class="artworks-grid">
    <div class="artworks-grid__list">
      <article
        v-for="(art, index) in artworks"
        :key="art.id || index"
        class="artwork-card"
        role="button"
        tabindex="0"
        :aria-label="getArtworkAriaLabel(art)"
        @click="handleArtworkClick(art)"
        @keydown.enter.prevent="handleArtworkClick(art)"
        @keydown.space.prevent="handleArtworkClick(art)"
      >
        <div class="artwork-card__media">
          <figure class="artwork-card__image-frame">
            <img :src="art.image" :alt="art.alt || art.title" loading="lazy" />
          </figure>
        </div>
        <div class="artwork-card__content">
          <div class="artwork-card__metadata">
            <h3 class="artwork-card__title">
              {{ art.title }}
            </h3>
            <div class="artwork-card__details">
              <p v-if="art.year" class="artwork-card__meta-year">{{ art.year }}</p>
              <p
                v-if="art.medium || art.dimensions"
                class="artwork-card__meta-secondary"
              >
                <span v-if="art.medium">{{ art.medium }}</span>
                <span v-if="art.medium && art.dimensions">, </span>
                <span v-if="art.dimensions">{{ art.dimensions }}</span>
              </p>
              <p
                v-if="formatMobileMetadata(art)"
                class="artwork-card__meta-mobile"
              >
                {{ formatMobileMetadata(art) }}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArtworksGrid',
  components: {},
  props: {
    artworks: {
      type: Array,
      default: () => [
        {
          id: 1,
          title: 'Red Horizon',
          image: '/artworks/plate (2)-edit.jpg',
          width: 2591,
          height: 4000,
          alt: 'Red abstract horizon painting',
          year: '2023',
          medium: 'Oil on canvas',
          dimensions: '120 × 90 cm',
        },
        {
          id: 2,
          title: 'Glass Fields',
          image: '/artworks/plate (3)-edit.jpg',
          width: 3209,
          height: 4000,
          alt: 'Glass sculpture in studio light',
          year: '2022',
          medium: 'Glass and resin',
          dimensions: '80 × 65 × 40 cm',
        },
        {
          id: 3,
          title: 'Veil Study',
          image: '/artworks/plate (5)-edit.jpg',
          width: 3966,
          height: 4000,
          alt: 'Monochrome drawing on textured paper',
          year: '2024',
          medium: 'Charcoal on paper',
          dimensions: '65 × 50 cm',
        },
        {
          id: 4,
          title: 'Silent Architectures',
          image: '/artworks/plate (6)-edit.jpg',
          width: 4000,
          height: 2994,
          alt: 'Architectural light installation in gallery',
          year: '2021',
          medium: 'Light installation',
          dimensions: 'Variable dimensions',
        },
        {
          id: 5,
          title: 'Chromatic Drift',
          image: '/artworks/plate (9)-edit_1.jpg',
          width: 3841,
          height: 4000,
          alt: 'Gradient abstract painting in blue tones',
          year: '2023',
          medium: 'Acrylic on panel',
          dimensions: '100 × 80 cm',
        },
        {
          id: 6,
          title: 'Arc Silhouette',
          image: '/artworks/plate (11)-edit.jpg',
          width: 4000,
          height: 3961,
          alt: 'Minimalist sculpture in matte black',
          year: '2022',
          medium: 'Bronze',
          dimensions: '55 × 35 × 30 cm',
        },
      ],
    },
  },
  emits: ['artwork-click'],
  methods: {
    handleArtworkClick(artwork) {
      this.$emit('artwork-click', artwork);
    },
    formatMobileMetadata(art) {
      return [art.year, art.medium, art.dimensions].filter(Boolean).join(', ');
    },
    getArtworkAriaLabel(art) {
      const parts = [art.title];
      if (art.year) parts.push(art.year);
      if (art.medium) parts.push(art.medium);
      if (art.dimensions) parts.push(art.dimensions);
      return parts.join(', ');
    },
  },
};
</script>

<style scoped>
.artworks-grid__list {
  display: grid;
  gap: var(--spacing-48);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.artwork-card {
  background: var(--color-surface-primary);
  padding: 0;
  display: grid;
  gap: var(--spacing-20);
  cursor: pointer;
}

/* Remove default focus outline */
.artwork-card:focus {
  outline: none;
}

/* Custom focus styles - keyboard navigation */
.artwork-card:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 4px;
}

.artwork-card__media {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.artwork-card__image-frame {
  position: relative;
  margin: 0;
  width: 100%;
  aspect-ratio: 5 / 7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0; /* fill the 5x7 frame without inner gap */
}

.artwork-card__image-frame img {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.artwork-card__content {
  display: grid;
  gap: var(--spacing-12);
}

.artwork-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 1.6vw, var(--font-size-28));
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
}

.artwork-card__metadata {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  align-items: flex-start;
  text-align: left;
  color: var(--color-text-secondary);
}

.artwork-card__details {
  display: grid;
  gap: var(--spacing-4);
  color: inherit;
}

.artwork-card__meta-year {
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

.artwork-card__meta-secondary {
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

.artwork-card__meta-mobile {
  display: none;
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

@media (hover: hover) and (pointer: fine) {
  .artwork-card:hover .artwork-card__title {
    color: var(--color-brand-primary);
  }
}

@media (max-width: 900px) {
  .artworks-grid__list {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-32);
  }

  .artwork-card__metadata {
    align-items: center;
    text-align: center;
    gap: var(--spacing-8);
  }

  .artwork-card__meta-year,
  .artwork-card__meta-secondary {
    display: none;
  }

  .artwork-card__meta-mobile {
    display: block;
    font-size: var(--font-size-14);
  }
}
</style>
