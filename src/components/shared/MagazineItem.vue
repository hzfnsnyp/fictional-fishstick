<template>
  <article class="magazine-item">
    <!-- Year/Source -->
    <div class="magazine-year">
      <span class="magazine-year__text">{{ magazine.name }}</span>
      <p v-if="magazine.meta" class="magazine-year__meta">{{ magazine.meta }}</p>
    </div>

    <!-- Content -->
    <div class="magazine-content">
      <!-- Title -->
      <ClickableTextComponent
        v-if="isClickable"
        action-type="navigation"
        :to="magazine.to || null"
        :href="magazine.url || undefined"
        :external="Boolean(magazine.url)"
        class="magazine-title-wrapper magazine-title-wrapper--link"
        @click="$emit('click', magazine)"
      >
        <h3 class="magazine-title magazine-title--link">
          {{ magazine.title }}
        </h3>
      </ClickableTextComponent>
      <div v-else class="magazine-title-wrapper">
        <h3 class="magazine-title">{{ magazine.title }}</h3>
      </div>

      <!-- Description -->
      <p v-if="magazine.description" class="magazine-description">
        {{ magazine.description }}
      </p>
    </div>
  </article>
</template>

<script>
import ClickableTextComponent from '../ui/ClickableTextComponent.vue'

export default {
  name: 'MagazineItem',
  components: {
    ClickableTextComponent
  },
  props: {
    magazine: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  computed: {
    isClickable() {
      return Boolean(this.magazine && (this.magazine.url || this.magazine.to))
    }
  }
}
</script>

<style scoped>
.magazine-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: var(--spacing-64);
  align-items: flex-start;
  padding-bottom: var(--spacing-48);
  margin-bottom: var(--spacing-48);
  border-bottom: 1px solid var(--color-border-default);
}

.magazine-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

/* Year/Source */
.magazine-year {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.magazine-year__text {
  font-family: var(--font-heading);
  font-size: var(--font-size-52);
  font-weight: var(--font-weight-light);
  color: var(--color-text-primary);
  line-height: 1;
}

.magazine-year__meta {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Content */
.magazine-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}

/* Title Wrapper */
.magazine-title-wrapper {
  display: block;
  color: var(--color-text-primary) !important;
  text-decoration: none !important;
  transition: color var(--transition-normal);
}

.magazine-title-wrapper--link {
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .magazine-title-wrapper--link:hover {
    color: var(--color-brand-primary) !important;
  }
}

.magazine-title-wrapper--link:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 4px;
  color: var(--color-brand-primary) !important;
}

/* Title */
.magazine-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-regular);
  color: inherit;
  margin: 0;
  line-height: 1.2;
  transition: color var(--transition-normal);
}

/* Description */
.magazine-description {
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .magazine-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-20);
    margin-bottom: var(--spacing-40);
    padding-bottom: var(--spacing-40);
  }

  .magazine-year__text {
    font-size: var(--font-size-38);
  }

  .magazine-year__meta {
    font-size: var(--font-size-14);
  }

  .magazine-title {
    font-size: var(--font-size-28);
    line-height: 1.25;
  }

  .magazine-description {
    font-size: var(--font-size-14);
  }
}

@media (max-width: 480px) {
  .magazine-item {
    margin-bottom: var(--spacing-32);
    padding-bottom: var(--spacing-32);
    gap: var(--spacing-16);
  }

  .magazine-year__text {
    font-size: var(--font-size-32);
  }

  .magazine-title {
    font-size: var(--font-size-24);
  }
}
</style>
