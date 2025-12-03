<template>
  <article class="archive-row">
    <div class="archive-row__label">{{ label }}</div>
    <component
      :is="href ? 'a' : 'div'"
      :class="['archive-row__body', { 'archive-row__body--link': href }]"
      :href="href || undefined"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
    >
      <p class="archive-row__title">
        {{ title }}
        <span v-if="href" class="archive-row__arrow" aria-hidden="true">→</span>
      </p>
      <p v-if="meta" class="archive-row__meta">{{ meta }}</p>
    </component>
  </article>
</template>

<script>
export default {
  name: 'ArchiveRow',
  props: {
    label: { type: String, required: true },
    title: { type: String, required: true },
    meta: { type: String, default: '' },
    href: { type: String, default: '' },
    external: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.archive-row {
  display: grid;
  grid-template-columns: 210px 1fr;
  column-gap: var(--spacing-24);
  padding-block: var(--spacing-12);
  font-family: var(--font-body);
}

/* Left column: Year / Date */
.archive-row__label {
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-22);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

/* Right column: Content */
.archive-row__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  color: var(--color-text-primary);
  text-decoration: none;
}

/* Title: 22px */
.archive-row__title {
  margin: 0;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-22);
  line-height: var(--line-height-tight);
}

/* Metadata: base size (16px) */
.archive-row__meta {
  margin: 0;
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

.archive-row__arrow {
  margin-left: var(--spacing-8);
  font-size: 1em;
  transition: transform var(--transition-normal);
}

/* Hover effects only for clickable links */
.archive-row__body--link:hover .archive-row__title {
  color: var(--color-brand-primary);
}

.archive-row__body--link:hover .archive-row__arrow {
  transform: translateX(var(--spacing-4));
}

@media (max-width: 768px) {
  .archive-row {
    grid-template-columns: 1fr;
    row-gap: var(--spacing-8);
  }

  .archive-row__label {
    order: -1;
    font-size: var(--font-size-18);
  }

  .archive-row__title {
    font-size: var(--font-size-20);
  }

  .archive-row__meta {
    font-size: var(--font-size-14);
  }
}
</style>
