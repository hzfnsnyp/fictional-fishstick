<template>
  <label class="switch" :class="{ 'switch--checked': modelValue, 'switch--disabled': disabled }">
    <input
      class="switch-input"
      type="checkbox"
      :id="switchId"
      :checked="modelValue"
      :disabled="disabled"
      :aria-labelledby="label ? switchId + '-label' : undefined"
      @change="$emit('update:modelValue', !modelValue)"
    />
    <span class="switch-track" aria-hidden="true">
      <span class="switch-thumb"></span>
    </span>
    <span v-if="label" class="switch-label" :id="switchId + '-label'">{{ label }}</span>
  </label>
  
</template>

<script>
import { defineComponent } from 'vue'
import { useUniqueId } from '@/composables/useUniqueId'

export default defineComponent({
  name: 'SwitchComponent',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(){
    const { id: switchId } = useUniqueId('switch')
    return { switchId }
  }
})
</script>

<style scoped>
/* Align with site controls and focus system */
.switch {
  --track-w: 44px;
  --track-h: 24px;
  --thumb: 20px;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-16);
  height: var(--button-height-small);
  cursor: pointer;
  user-select: none;
}
.switch--disabled { opacity: 0.6; cursor: not-allowed; }

.switch-input { position: absolute; opacity: 0; pointer-events: none; }

.switch-track {
  width: var(--track-w);
  height: var(--track-h);
  border-radius: 0; /* straight corners */
  background: var(--color-surface-disabled); /* OFF background */
  border: var(--border-width) solid var(--color-surface-disabled); /* match background */
  position: relative;
  transition: background var(--transition-normal), border-color var(--transition-normal);
  box-sizing: border-box;
}
.switch-thumb {
  position: absolute; top: 50%; left: 2px; transform: translateY(-50%);
  width: var(--thumb); height: var(--thumb);
  border-radius: 0; /* straight corners */
  background: var(--color-surface-primary); /* Thumb color (both states) */
  transition: left var(--transition-normal);
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

/* States */
/* OFF hover */
@media (hover: hover) and (pointer: fine) {
  .switch:hover:not(.switch--disabled):not(.switch--checked) .switch-track {
    background: var(--color-bg-pressed);
    border-color: var(--color-bg-pressed);
  }
}
/* ON base */
.switch--checked .switch-track { background: var(--color-brand-primary); border-color: var(--color-brand-primary); }
.switch--checked .switch-thumb { left: calc(100% - (2px + var(--thumb))); background: var(--color-surface-primary); }
/* ON hover */
@media (hover: hover) and (pointer: fine) {
  .switch--checked:hover .switch-track { background: var(--color-brand-hover); border-color: var(--color-brand-hover); }
}

/* Focus ring hooks into base/_focus_styles.css */
.switch-input:focus-visible + .switch-track { box-shadow: var(--shadow-focus-ring); }

.switch-label { font-family: var(--font-body); font-size: var(--font-size-18); color: var(--color-text-primary); line-height: var(--lh-16); }

@media (max-width: 768px) {
  .switch { --track-w: 40px; --track-h: 22px; --thumb: 18px; height: var(--button-height-small); }
}
</style>
