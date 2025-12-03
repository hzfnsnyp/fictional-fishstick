<template>
  <section class="techniques" aria-labelledby="techniques-statement">
    <div :class="[containerClass, 'techniques__grid']">
      <p id="techniques-statement" class="techniques__statement">
        {{ statement }}
      </p>
      <div class="techniques__list">
        <div v-for="(feat, i) in displayedFeatures" :key="i" class="techniques__item">
          <h3 class="techniques__item-title">{{ feat.title }}</h3>
          <p class="techniques__item-text">{{ feat.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapContainer } from '@/utils/containerClass'
export default {
  name: 'TechniquesOverviewSection',
  props: {
    container: { type: String, default: 'main' },
    statement: {
      type: String,
      default: 'Technique is the architecture that holds light and feeling together.'
    },
    features: {
      type: Array,
      default: () => [
        {
          title: 'Color Matrix',
          text:
            'A field of pure pigment dots establishes the rhythm of color and air—the slow foundation where depth is already implied.'
        },
        {
          title: 'Glazes',
          text:
            'Transparent layers build depth and luminosity; light passes through and returns with a soft, living hue.'
        },
        {
          title: 'Integration & Impasto',
          text:
            'The surface is gently unified, then resolved with decisive impasto strokes—thick relief marks that crystallize feeling into form.'
        }
      ]
    }
  },
  computed: {
    containerClass() {
      return mapContainer(this.container)
    },
    displayedFeatures() {
      return this.features.slice(0, 3)
    }
  }
}
</script>

<style scoped>
.techniques {
  padding-top: var(--spacing-96);
}

.techniques__grid {
  display: grid;
  gap: var(--spacing-64);
  align-items: start;
}

.techniques__statement {
  margin: 0;
  font-family: var(--font-body);
  font-weight: var(--font-weight-light);
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  font-size: clamp(1.75rem, 4.5vw, var(--font-size-48));
}

.techniques__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-64);
  padding-top: var(--spacing-48);
}

.techniques__item {
  display: grid;
  gap: var(--spacing-20);
}

.techniques__item-title {
  margin: 0;
  font-family: var(--font-body);
  font-weight: var(--font-weight-light);
  color: var(--color-text-primary);
  font-size: clamp(1.5rem, 3vw, var(--font-size-32));
  text-transform: none;
  letter-spacing: normal;
}

.techniques__item-text {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-18);
  line-height: var(--line-height-loose);
}

@media (max-width: 1024px) {
  .techniques__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .techniques__statement {
    font-size: clamp(1.5rem, 7vw, var(--font-size-38));
    line-height: 1.08;
  }

  .techniques__list {
    grid-template-columns: 1fr;
    gap: var(--spacing-32);
  }
}
</style>
