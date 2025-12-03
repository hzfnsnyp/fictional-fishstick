<template>
  <div
    class="filter-checklist"
    :class="{ 'filter-checklist--grid': columns }"
    :style="columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : {}"
    role="group"
    :aria-label="ariaLabel"
  >
    <label
      v-for="(opt, index) in options"
      :key="opt.value"
      class="filter-checklist__item"
      :class="{ 'is-selected': isChecked(opt.value) }"
    >
      <input
        type="checkbox"
        class="filter-checklist__input"
        :id="getInputId(opt, index)"
        :checked="isChecked(opt.value)"
        :aria-describedby="getDescribedBy(opt, index)"
        @change="toggle(opt.value)"
      />

      <!-- button-like row -->
      <span class="filter-checklist__button" :class="{ 'filter-checklist__button--centered': centered }">
        <span class="filter-checklist__label">{{ opt.label }}</span>
      </span>

      <span
        v-if="opt.hint"
        class="filter-checklist__hint"
        :id="getHintId(opt, index)"
      >
        {{ opt.hint }}
      </span>
    </label>
  </div>
  
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FilterChecklist',
  props: {
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    allowAll: { type: Boolean, default: false },
    allValue: { type: [String, Number], default: 'all' },
    ariaLabel: { type: String, default: '' },
    centered: { type: Boolean, default: false },
    columns: { type: Number, default: null },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      baseId: `filter-checklist-${Math.random().toString(36).slice(2, 10)}`
    }
  },
  methods: {
    isChecked(value) {
      return this.modelValue.includes(value)
    },
    toggle(value) {
      let set = new Set(this.modelValue)
      if (set.has(value)) set.delete(value)
      else {
        set.add(value)
        // If choosing non-all, remove 'all'
        if (this.allowAll && value !== this.allValue) set.delete(this.allValue)
      }
      // If choosing 'all', clear others
      if (this.allowAll && value === this.allValue) set = new Set([this.allValue])
      const next = Array.from(set)
      this.$emit('update:modelValue', next)
      this.$emit('change', next)
    },
    sanitize(value, fallback) {
      if (value === undefined || value === null) return fallback
      return String(value).replace(/[^a-zA-Z0-9_-]/g, '-')
    },
    getInputId(opt, index) {
      return `${this.baseId}-input-${this.sanitize(opt.value, index)}`
    },
    getHintId(opt, index) {
      if (!opt.hint) return null
      return `${this.baseId}-hint-${this.sanitize(opt.value, index)}`
    },
    getDescribedBy(opt, index) {
      const hintId = this.getHintId(opt, index)
      return hintId || null
    }
  },
})
</script>

<style scoped>
.filter-checklist {
  display: grid;
  gap: var(--spacing-16);
  width: 100%;
  min-width: 0;
  overflow: visible;
}

/* Grid mode with multiple columns */
.filter-checklist--grid {
  gap: var(--spacing-20);
}

/* Clickable row behaving like a small button */
.filter-checklist__item {
  position: relative;
  display: grid;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}

.filter-checklist__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.filter-checklist__button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  min-height: var(--button-height-small);
  border: var(--border-width) solid var(--color-text-secondary);
  background: var(--color-surface-primary);
  color: var(--color-text-secondary);
  border-radius: 0; /* no rounding */
  text-transform: none; /* prevent any uppercase inheritance */
  transition: var(--transition-normal);
  outline: none; /* remove browser outline, use custom focus ring */
}

.filter-checklist__button--centered {
  justify-content: center; /* center text for medium filters */
}

/* Custom focus ring when checkbox is focused */
.filter-checklist__input:focus-visible + .filter-checklist__button {
  box-shadow: var(--shadow-focus-ring);
}

@media (hover: hover) and (pointer: fine) {
  .filter-checklist__item:hover .filter-checklist__button:not(.is-selected) {
    background: var(--color-surface-secondary);
    border-color: var(--color-surface-secondary);
    color: var(--color-text-primary);
  }
}

.filter-checklist__item.is-selected .filter-checklist__button {
  /* primary default */
  background: var(--color-surface-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-brand-primary);
}

/* Hover on selected: brand hover color, surface secondary background */
@media (hover: hover) and (pointer: fine) {
  .filter-checklist__item.is-selected:hover .filter-checklist__button {
    background: var(--color-surface-secondary);
    border-color: var(--color-brand-primary-hover, #7a0a0c);
    color: var(--color-brand-primary-hover, #7a0a0c);
  }
}

.filter-checklist__label {
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  white-space: nowrap;
}

/* Optional hint on hover (like extra info) */
.filter-checklist__hint {
  font-size: var(--font-size-14);
  color: var(--color-text-muted);
  opacity: 0; height: 0; overflow: hidden; transition: opacity var(--transition-normal), height var(--transition-normal);
}
@media (hover: hover) and (pointer: fine) {
  .filter-checklist__item:hover .filter-checklist__hint { opacity: 1; height: auto; }
}
</style>
