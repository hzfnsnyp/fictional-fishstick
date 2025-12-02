<template>
  <div class="medium-select" role="group" :aria-label="ariaLabel">
    <button
      v-for="(opt, index) in options"
      :key="opt.value"
      type="button"
      class="medium-select__option"
      :class="{ 'is-selected': isSelected(opt.value) }"
      role="checkbox"
      :aria-checked="isSelected(opt.value) ? 'true' : 'false'"
      :aria-setsize="options.length"
      :aria-posinset="index + 1"
      @click="toggle(opt.value)"
    >
      <span class="medium-select__title">{{ opt.label }}</span>
      <span v-if="opt.count != null" class="medium-select__count">{{ opt.count }}</span>
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MediumMultiSelect',
  props: {
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    ariaLabel: { type: String, default: 'Medium' },
  },
  emits: ['update:modelValue', 'change'],
  methods: {
    isSelected(value) {
      return this.modelValue.includes(value)
    },
    toggle(value) {
      const set = new Set(this.modelValue)
      if (set.has(value)) set.delete(value)
      else set.add(value)
      const next = Array.from(set)
      this.$emit('update:modelValue', next)
      this.$emit('change', next)
    },
  },
})
</script>

<style scoped>
/* Same spacing language as years */
.medium-select { display: grid; grid-template-columns: 1fr; gap: var(--spacing-20); }

.medium-select__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center; /* center title regardless of count width */
  width: 100%;
  border: var(--border-width) solid var(--color-text-secondary);
  background: var(--color-surface-primary);
  color: var(--color-text-secondary);
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  min-height: var(--button-height-small);
  cursor: pointer;
  transition: var(--transition-normal);
  outline: none; /* remove browser outline, use custom focus ring */
}

/* Custom focus ring */
.medium-select__option:focus-visible {
  box-shadow: var(--shadow-focus-ring);
}

/* Hover: mirror chips */
@media (hover: hover) and (pointer: fine) {
  .medium-select__option:hover:not(.is-selected) {
    background: var(--color-surface-secondary);
    border-color: var(--color-surface-secondary);
    color: var(--color-text-primary);
  }
}

/* Selected: brand-accent like chips */
.medium-select__option.is-selected {
  background: var(--color-surface-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-brand-primary);
}

/* Hover on selected: brand hover color, surface secondary background */
@media (hover: hover) and (pointer: fine) {
  .medium-select__option.is-selected:hover {
    background: var(--color-surface-secondary);
    border-color: var(--color-brand-primary-hover, #7a0a0c);
    color: var(--color-brand-primary-hover, #7a0a0c);
  }
}
.medium-select__title { 
  font-family: var(--font-body); 
  font-size: var(--font-size-18); 
  font-weight: var(--font-weight-medium); 
  text-align: center; 
}

/* Count badge on right (like Series) */
.medium-select__count {
  position: absolute;
  right: var(--button-padding-small-h);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-14);
  color: var(--color-text-secondary);
  background: var(--color-surface-secondary);
  padding: 4px 10px;
  border-radius: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

/* Show count on hover/focus */
@media (hover: hover) and (pointer: fine) {
  .medium-select__option:hover .medium-select__count { opacity: 1; visibility: visible; }
}

.medium-select__option:focus-visible .medium-select__count { opacity: 1; visibility: visible; }

/* When selected: count has no background and is brand primary */
.medium-select__option.is-selected .medium-select__count {
  background: transparent;
  color: var(--color-brand-primary);
}

/* Hover on selected: count is brand hover color */
@media (hover: hover) and (pointer: fine) {
  .medium-select__option.is-selected:hover .medium-select__count {
    color: var(--color-brand-primary-hover, #7a0a0c);
  }
}
</style>
