<template>
  <section class="hero-block layout-full">
    <div class="hero-container layout-main">
      <div class="hero-inner">
        <figure class="hero-figure">
          <img
            v-if="!useFallback"
            ref="imgRef"
            :src="imageSrc"
            :alt="imageAlt"
            class="hero-image"
            loading="lazy"
            @load="onImageLoad"
            @error="onImageError"
          />
          <div
            v-else
            class="hero-image hero-image--fallback"
            aria-hidden="true"
          ></div>
          <figcaption v-if="hasMetadata" class="hero-meta">
            {{ metadataText }}
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HeroBlock",
  props: {
    imageSrc: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    title: { type: String, default: "" },
    year: { type: [String, Number], default: "" },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
  },
  data() {
    return {
      useFallback: false,
    };
  },
  computed: {
    hasMetadata() {
      return this.title || this.year || this.medium || this.dimensions;
    },
    metadataText() {
      const metadata = [];
      if (this.title) metadata.push(this.title);
      if (this.year) metadata.push(this.year);
      if (this.medium) metadata.push(this.medium);
      if (this.dimensions) metadata.push(this.dimensions);
      return metadata.join(', ');
    }
  },
  methods: {
    onImageLoad() {
      // reserved for future use
    },
    onImageError() {
      this.useFallback = true;
    },
  },
};
</script>

<style scoped>
/* ==========================================================================
   Hero Block – centered artwork with responsive meta
   ========================================================================== */

.hero-block {
  background: var(--color-surface-primary);
  padding-block: var(--spacing-64);
}

.hero-container {
  display: flex;
  justify-content: center;
}

.hero-inner {
  display: flex;
  gap: var(--spacing-64);
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - 2 * var(--spacing-64));
  width: 100%;
}

.hero-figure {
  margin: 0;
  flex: 0 1 100%;
  width: min(100%, 640px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: var(--spacing-20);
}

.hero-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform var(--transition-normal);
  transform-origin: center center;
}

.hero-image--fallback {
  aspect-ratio: 1 / 1;
  background: linear-gradient(135deg, #a7c4ff 0%, #7bb5ff 40%, #d6e3ff 100%);
  width: 100%;
}

.hero-meta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-24);
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  line-height: 1.5;
  color: var(--color-text-primary);
  text-align: center;
}

/* ==========================================================================
   Responsiveness
   ========================================================================== */

@media (max-width: 1024px) {
  .hero-inner {
    gap: var(--spacing-48);
  }
}

@media (max-width: 900px) {
  .hero-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-meta {
    font-size: var(--font-size-14);
  }
}

@media (max-width: 640px) {
  .hero-block {
    padding-block: var(--spacing-48);
  }

  .hero-inner {
    min-height: calc(
      100svh - (var(--header-height) + var(--border-width)) - 2 *
        var(--spacing-48)
    );
  }

  .hero-figure {
    flex-basis: auto;
    width: 100%;
    gap: var(--spacing-16);
  }

  .hero-meta {
    font-size: var(--font-size-14);
  }
}

/* ==========================================================================
   Hover interaction
   ========================================================================== */
@media (hover: hover) and (pointer: fine) {
  .hero-image:hover {
    transform: scale(0.98);
  }
}
</style>
