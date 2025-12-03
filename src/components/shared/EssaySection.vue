<template>
  <section class="studio-overview" aria-labelledby="studio-overview-heading">
    <div :class="[containerClass, 'studio-overview__grid']">
      <header class="studio-overview__title">
        <h2 v-if="headingLine1" id="studio-overview-heading">
          {{ headingLine1 }}
        </h2>
        <h2 v-if="headingLine2">{{ headingLine2 }}</h2>
        <h2 v-if="headingLine3">{{ headingLine3 }}</h2>
      </header>

      <article class="studio-overview__content prose">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </article>

      <figure class="signature" v-if="signatureSrc">
        <img :src="signatureSrc" :alt="signatureAlt" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<script>
import { mapContainer } from "@/utils/containerClass";
export default {
  name: "EssaySection",
  props: {
    container: { type: String, default: "main" },
    headingLine1: { type: String, default: "Artist Overview" },
    headingLine2: { type: String, default: "" },
    headingLine3: { type: String, default: "" },
    paragraphs: {
      type: Array,
      default: () => [
        "Painting begins with observation. Harmonic ratios set the stage while light determines how each surface will breathe.",
        "Layered glazes meet decisive impasto strokes: structure holds, intuition resolves. Every series evolves from that dialogue.",
        "The studio keeps detailed archives of process, pigments, and formulas, mapping ideas across ongoing exhibition cycles.",
      ],
    },
    signatureSrc: {
      type: String,
      default:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120"><rect width="100%" height="100%" fill="%23910d0f"/></svg>',
    },
    signatureAlt: { type: String, default: "Signature mark" },
  },
  computed: {
    containerClass() {
      return mapContainer(this.container);
    },
  },
};
</script>

<style scoped>
.studio-overview {
  padding-block: var(--spacing-64);
}

.studio-overview__grid {
  display: grid;
  grid-template-columns: minmax(220px, 0.35fr) minmax(0, 1fr);
  column-gap: var(--spacing-64);
  row-gap: var(--spacing-48);
  align-items: start;
}

.studio-overview__title {
  grid-column: 1;
  /* Align baseline with content start - remove default spacing */
}

.studio-overview__title h2 {
  margin: 0;
  font-size: var(--font-size-38);
  line-height: var(--line-height-heading);
  color: var(--color-text-primary);
  text-transform: none;
}

.studio-overview__title h2 + h2 {
  margin-top: var(--spacing-8);
}

.studio-overview__content {
  grid-column: 2;
  margin: 0;
  /* Text naturally aligns with heading baseline */
}

.studio-overview__content p {
  font-size: var(--font-size-18);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  margin: 0;
}

.studio-overview__content p + p {
  margin-top: var(--spacing-24);
}

.signature {
  margin: 0;
  margin-top: var(--spacing-32);
  grid-column: 1 / -1;
}

.signature img {
  height: var(--spacing-56);
  width: auto;
  opacity: 0.9;
}

/* Tablet adaptation */
@media (max-width: 1024px) {
  .studio-overview__grid {
    column-gap: var(--spacing-48);
  }

  .studio-overview__title h2 {
    font-size: var(--font-size-32);
  }
}

/* Mobile adaptation */
@media (max-width: 768px) {
  .studio-overview {
    padding-block: var(--spacing-48);
  }

  .studio-overview__grid {
    grid-template-columns: 1fr;
    row-gap: var(--spacing-32);
  }

  .studio-overview__title,
  .studio-overview__content {
    grid-column: 1;
  }

  .studio-overview__title h2 {
    font-size: var(--font-size-28);
  }

  .studio-overview__content p {
    font-size: var(--font-size-16);
  }

  .studio-overview__content p + p {
    margin-top: var(--spacing-20);
  }

  .signature {
    margin-top: var(--spacing-24);
    justify-self: start;
  }

  .signature img {
    height: var(--spacing-48);
  }
}
</style>
