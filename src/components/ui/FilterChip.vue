<template>
  <span
    class="chip"
  >
    <span class="chip__label"><slot>{{ label }}</slot></span>
    <button
      v-if="removable"
      class="chip__remove"
      type="button"
      :aria-label="`Remove ${label} filter`"
      :title="`Remove ${label} filter`"
      @click.stop="$emit('remove')"
    >
      <IconComponent name="cross" :size="24" />
    </button>
  </span>
  
</template>

<script>
import { defineComponent } from 'vue'
import IconComponent from '@/components/ui/IconComponent.vue'

export default defineComponent({
  name: 'FilterChip',
  props: {
    label: { type: String, default: '' },
    removable: { type: Boolean, default: true },
  },
  emits: ['remove'],
  components: { IconComponent }
})
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-12);
  /* Filled subtle look */
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-surface-secondary);
  /* Small button sizing */
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  min-height: var(--button-height-small);
  border-radius: 0; /* no rounding to match style */
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-regular);
  transition: var(--transition-normal);
}
.chip--clickable { cursor: default; }
.chip__label { line-height: 1; }
.chip__remove {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0; /* keep compact */
  margin-inline-start: var(--spacing-16);
  transition: color var(--transition-fast), opacity var(--transition-fast);
}
@media (hover: hover) and (pointer: fine) {
  .chip__remove:hover { color: var(--color-brand-primary); }
}
.chip__remove:active { color: var(--color-brand-hover); }
</style>
