<template>
  <section
    class="hero-section with-background"
    :style="{ '--bg-color': 'var(--color-surface-primary)' }"
  >
    <div :class="[containerClass, 'hero-wrap']">
      <div class="hero-copy">
        <p class="hero-text">
          {{ title }}
        </p>
      </div>
      <figure class="hero-figure">
        <img
          class="hero-image"
          :src="imageSrc"
          :alt="imageAlt"
          loading="lazy"
        />
        <figcaption v-if="hasMetadata" class="hero-meta">
          {{ metadataText }}
        </figcaption>
      </figure>
    </div>
  </section>
  <span class="visually-hidden" aria-live="polite">Hero section</span>
</template>

<script>
import { mapContainer } from "@/utils/containerClass";

export default {
  name: "HeroSection",
  props: {
    container: { type: String, default: "main" },
    title: {
      type: String,
      default:
        "I choose beauty as a discipline—painting that speaks quietly and endures.",
    },
    imageSrc: {
      type: String,
      default:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="100%" height="100%" fill="%23910d0f"/></svg>',
    },
    imageAlt: {
      type: String,
      default: "Studio detail, palette knives and layered canvas",
    },
    artworkTitle: { type: String, default: "" },
    year: { type: [String, Number], default: "" },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
  },
  computed: {
    containerClass() {
      return mapContainer(this.container);
    },
    hasMetadata() {
      return this.artworkTitle || this.year || this.medium || this.dimensions;
    },
    metadataText() {
      const metadata = [];
      if (this.artworkTitle) metadata.push(this.artworkTitle);
      if (this.year) metadata.push(this.year);
      if (this.medium) metadata.push(this.medium);
      if (this.dimensions) metadata.push(this.dimensions);
      return metadata.join(', ');
    },
  },
};
</script>

<style scoped>
.hero-section {
  padding-block: 0;
  min-height: calc(100vh - var(--header-height));
  display: grid;
  place-items: center;
}

.hero-wrap {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  align-items: center;
  gap: var(--spacing-64);
  padding-block: 0;
  width: 100%;
  max-width: 1400px;
  justify-content: center;
  align-content: center;
}

.hero-text {
  margin: 0;
  font-family: var(--font-body);
  font-weight: var(--font-weight-light);
  line-height: 1.05;
  font-size: clamp(2rem, 6vw, var(--font-size-60));
  white-space: pre-line;
  max-width: 56ch;
}

.hero-figure {
  margin: 0;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: clamp(320px, 42vw, 720px);
  max-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.hero-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  display: block;
  filter: grayscale(0.1) contrast(1.05);
}

.hero-meta {
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  line-height: 1.5;
  color: var(--color-text-primary);
  text-align: center;
  margin-top: var(--spacing-16);
  padding-inline: var(--spacing-16);
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .hero-section {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    align-items: center;
    padding-block: var(--spacing-32);
  }

  .hero-wrap {
    grid-template-columns: 1fr;
    gap: var(--spacing-32);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-text {
    text-align: center;
    font-size: clamp(1.6rem, 7vw, var(--font-size-52));
  }

  .hero-figure {
    order: 2;
    margin-top: var(--spacing-24);
    width: 100%;
    display: flex;
    justify-content: center;
    aspect-ratio: 1 / 1;
    max-width: min(520px, 90vw);
    max-height: 65vh;
  }

  .hero-image {
    width: 100%;
    height: auto;
    max-width: min(520px, 90%);
    max-height: 65vh;
    aspect-ratio: 1 / 1;
    object-fit: contain;
  }

  .hero-meta {
    font-size: var(--font-size-14);
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
