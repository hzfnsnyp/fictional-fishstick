<template>
  <article class="press-item">
    <!-- Year/Source -->
    <div class="press-year">
      <span class="press-year__text">{{ press.name }}</span>
      <p v-if="press.meta" class="press-year__meta">{{ press.meta }}</p>
    </div>

    <!-- Content -->
    <div class="press-content">
      <!-- Title with subtitle -->
      <ClickableTextComponent
        v-if="isClickable"
        action-type="navigation"
        :to="press.to || null"
        :href="press.url || undefined"
        :external="Boolean(press.url)"
        class="press-title-wrapper press-title-wrapper--link"
        @click="$emit('click', press)"
      >
        <div>
          <h3 class="press-title press-title--link">
            {{ press.title }}
          </h3>
          <p v-if="press.subtitle" class="press-subtitle">
            {{ press.subtitle }}
          </p>
        </div>
      </ClickableTextComponent>
      <div v-else class="press-title-wrapper">
        <h3 class="press-title">{{ press.title }}</h3>
        <p v-if="press.subtitle" class="press-subtitle">
          {{ press.subtitle }}
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import ClickableTextComponent from '../ui/ClickableTextComponent.vue'

export default {
  name: 'PressMediaItem',
  components: {
    ClickableTextComponent
  },
  props: {
    press: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  computed: {
    isClickable() {
      return Boolean(this.press && (this.press.url || this.press.to))
    }
  }
}
</script>

<style scoped>
.press-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: var(--spacing-64);
  align-items: flex-start;
  padding-bottom: var(--spacing-48);
  margin-bottom: var(--spacing-48);
  border-bottom: 1px solid var(--color-border-default);
}

.press-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

/* Year/Source */
.press-year {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.press-year__text {
  font-family: var(--font-heading);
  font-size: var(--font-size-52);
  font-weight: var(--font-weight-light);
  color: var(--color-text-primary);
  line-height: 1;
}

.press-year__meta {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Content */
.press-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}

/* Title Wrapper */
.press-title-wrapper {
  color: var(--color-text-primary) !important;
  text-decoration: none !important;
  transition: color var(--transition-normal);
  display: block;
}

.press-title-wrapper--link {
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .press-title-wrapper--link:hover {
    color: var(--color-brand-primary) !important;
  }
}

.press-title-wrapper--link:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 4px;
  color: var(--color-brand-primary) !important;
}

/* Title */
.press-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-regular);
  color: inherit;
  margin: 0 0 var(--spacing-8) 0;
  line-height: 1.2;
  transition: color var(--transition-normal);
}

/* Subtitle */
.press-subtitle {
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
  .press-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-20);
    margin-bottom: var(--spacing-40);
    padding-bottom: var(--spacing-40);
  }

  .press-year__text {
    font-size: var(--font-size-38);
  }

  .press-year__meta {
    font-size: var(--font-size-14);
  }

  .press-title {
    font-size: var(--font-size-28);
    line-height: 1.25;
  }

  .press-subtitle {
    font-size: var(--font-size-14);
  }
}

@media (max-width: 480px) {
  .press-item {
    margin-bottom: var(--spacing-32);
    padding-bottom: var(--spacing-32);
    gap: var(--spacing-16);
  }

  .press-year__text {
    font-size: var(--font-size-32);
  }

  .press-title {
    font-size: var(--font-size-24);
  }
}
</style>
