<template>
  <div class="media-source-info">
    <p class="source-name">{{ name }}</p>
    <p v-if="meta" class="source-meta">{{ meta }}</p>
  </div>
</template>

<script>
export default {
  name: 'MediaSourceInfo',
  props: {
    name: {
      type: String,
      required: true
    },
    meta: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.media-source-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-16);
}

.source-name {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.source-meta {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}
</style>
