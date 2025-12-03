<template>
  <article class="radio-item">
    <!-- Year/Source -->
    <div class="radio-year">
      <span class="radio-year__text">{{ radio.name }}</span>
      <p v-if="radio.meta" class="radio-year__meta">{{ radio.meta }}</p>
    </div>

    <!-- Content -->
    <div class="radio-content">
      <!-- Title with subtitle -->
      <ClickableTextComponent
        v-if="isClickable"
        action-type="navigation"
        :to="radio.to || null"
        :href="radio.url || undefined"
        :external="Boolean(radio.url)"
        class="radio-title-wrapper radio-title-wrapper--link"
        @click="$emit('click', radio)"
      >
        <div>
          <h3 class="radio-title radio-title--link">
            {{ radio.title }}
          </h3>
          <p v-if="radio.subtitle" class="radio-subtitle">
            {{ radio.subtitle }}
          </p>
        </div>
      </ClickableTextComponent>
      <div v-else class="radio-title-wrapper">
        <h3 class="radio-title">{{ radio.title }}</h3>
        <p v-if="radio.subtitle" class="radio-subtitle">
          {{ radio.subtitle }}
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import ClickableTextComponent from '../ui/ClickableTextComponent.vue'

export default {
  name: 'RadioItem',
  components: {
    ClickableTextComponent
  },
  props: {
    radio: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  computed: {
    isClickable() {
      return Boolean(this.radio && (this.radio.url || this.radio.to))
    }
  }
}
</script>

<style scoped>
.radio-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: var(--spacing-64);
  align-items: flex-start;
  padding-bottom: var(--spacing-48);
  margin-bottom: var(--spacing-48);
  border-bottom: 1px solid var(--color-border-default);
}

.radio-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

/* Year/Source */
.radio-year {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.radio-year__text {
  font-family: var(--font-heading);
  font-size: var(--font-size-52);
  font-weight: var(--font-weight-light);
  color: var(--color-text-primary);
  line-height: 1;
}

.radio-year__meta {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Content */
.radio-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}

/* Title Wrapper */
.radio-title-wrapper {
  color: var(--color-text-primary) !important;
  text-decoration: none !important;
  transition: color var(--transition-normal);
  display: block;
}

.radio-title-wrapper--link {
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .radio-title-wrapper--link:hover {
    color: var(--color-brand-primary) !important;
  }
}

.radio-title-wrapper--link:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 4px;
  color: var(--color-brand-primary) !important;
}

/* Title */
.radio-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-regular);
  color: inherit;
  margin: 0 0 var(--spacing-8) 0;
  line-height: 1.2;
  transition: color var(--transition-normal);
}

/* Subtitle */
.radio-subtitle {
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
  font-style: italic;
}

/* Mobile */
@media (max-width: 768px) {
  .radio-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-20);
    margin-bottom: var(--spacing-40);
    padding-bottom: var(--spacing-40);
  }

  .radio-year__text {
    font-size: var(--font-size-38);
  }

  .radio-year__meta {
    font-size: var(--font-size-14);
  }

  .radio-title {
    font-size: var(--font-size-28);
    line-height: 1.25;
  }

  .radio-subtitle {
    font-size: var(--font-size-14);
  }
}

@media (max-width: 480px) {
  .radio-item {
    margin-bottom: var(--spacing-32);
    padding-bottom: var(--spacing-32);
    gap: var(--spacing-16);
  }

  .radio-year__text {
    font-size: var(--font-size-32);
  }

  .radio-title {
    font-size: var(--font-size-24);
  }
}
</style>
