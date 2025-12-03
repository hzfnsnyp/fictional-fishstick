<template>
<section :class="[containerClass, 'featured-list']" aria-labelledby="featured-magazines-heading">
    <h3 id="featured-magazines-heading" class="featured-list__heading">Magazines</h3>
    <ul class="featured-list__items">
      <li v-for="(item, index) in items" :key="index" class="featured-list__item">
        <div class="featured-list__row">
          <p class="featured-list__title">{{ item.title }}</p>
          <p class="featured-list__meta">
            <span>{{ item.location }}</span>
            <span class="featured-list__accent">, {{ item.date }}</span>
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapContainer } from '@/utils/containerClass'

export default {
  name: 'FeaturedMagazinesList',
  props: {
    container: {
      type: String,
      default: 'content'
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    containerClass() {
      return mapContainer(this.container)
    }
  }
}
</script>

<style scoped>
.featured-list {
  display: grid;
  gap: var(--spacing-16);
  padding-block: var(--spacing-24);
  border-bottom: 1px solid var(--color-border-subtle);
}

.featured-list__heading {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--font-weight-light);
  font-size: var(--font-size-22);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

.featured-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--spacing-16);
}

.featured-list__item {
  display: grid;
  gap: var(--spacing-8);
}

.featured-list__row {
  display: grid;
  grid-template-columns: minmax(0, 0.6fr) minmax(0, 1fr);
  gap: var(--spacing-16);
  align-items: start;
}

.featured-list__title,
.featured-list__meta {
  margin: 0;
  font-size: var(--font-size-22);
  line-height: var(--line-height-normal);
}

.featured-list__title {
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}

.featured-list__meta {
  font-family: var(--font-body);
  color: var(--color-text-primary);
}

.featured-list__accent {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .featured-list__row {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}
</style>
