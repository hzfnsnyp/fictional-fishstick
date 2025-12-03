<template>
  <component
    :is="tag"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--disabled': disabled,
        'btn--loading': loading,
      },
    ]"
    :disabled="isButton && (disabled || loading)"
    :type="isButton ? type : undefined"
    :aria-disabled="!isButton && (disabled || loading) ? 'true' : null"
    :tabindex="forceDisabled ? -1 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="loading" class="btn__loading">...</span>
    <span v-else class="btn__content">
      <slot />
    </span>
  </component>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "ButtonComponent",
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "secondary", "tertiary", "itinerary"].includes(value),
    },
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["large", "medium", "small"].includes(value),
    },
    tag: {
      type: String,
      default: "button",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "button",
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const isButton = computed(() => props.tag === "button");
    const forceDisabled = computed(() => props.disabled || props.loading);

    const handleClick = (event) => {
      if (forceDisabled.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      emit("click", event);
    };

    const handleKeydown = (event) => {
      if (forceDisabled.value) {
        event.preventDefault();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick(event);
      }
    };

    return {
      isButton,
      forceDisabled,
      handleClick,
      handleKeydown,
    };
  },
});
</script>

<style scoped>
/* ==========================================================================
   BASE BUTTON STYLES - Updated Typography
   ========================================================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Default medium size typography */
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 18px desktop, 16px mobile */
  line-height: var(--lh-18); /* 18px × 1.3333 = 24px (3 × 8px) */
  font-weight: var(--font-weight-regular); /* 400 */
  padding: var(--button-padding-medium-v) var(--button-padding-medium-h);
  min-height: var(--button-height-medium);

  /* Visual styling */
  text-decoration: none;
  border: var(--border-width) solid transparent;
  cursor: pointer;
  transition: var(--transition-normal);
  outline: none;
  white-space: nowrap;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  position: relative;
}

/* Active state - no movement */
.btn:active:not(.btn--disabled):not(.btn--loading) {
  transform: none;
}

 

/* Button content wrapper */
.btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Loading animation */
.btn__loading {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* ==========================================================================
   PRIMARY BUTTON - Using CSS Variables
   ========================================================================== */
.btn--primary {
  background: var(--color-surface-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-brand-primary);
}

@media (hover: hover) and (pointer: fine) {
  .btn--primary:hover:not(.btn--disabled):not(.btn--loading) {
    background: var(--color-brand-primary);
    border-color: var(--color-brand-primary);
    color: var(--color-surface-primary);
  }
}

.btn--primary:active:not(.btn--disabled):not(.btn--loading) {
  background: var(--color-brand-hover);
  border-color: var(--color-brand-hover);
  color: var(--color-surface-primary);
}

/* ==========================================================================
   SECONDARY BUTTON - Using CSS Variables
   ========================================================================== */
.btn--secondary {
  background: var(--color-surface-primary);
  border-color: var(--color-text-secondary);
  color: var(--color-text-secondary);
}

@media (hover: hover) and (pointer: fine) {
  .btn--secondary:hover:not(.btn--disabled):not(.btn--loading) {
    background: var(--color-surface-secondary);
    border-color: var(--color-surface-secondary);
    color: var(--color-text-primary);
  }
}

.btn--secondary:active:not(.btn--disabled):not(.btn--loading) {
  background: var(--color-bg-pressed);
  border-color: var(--color-bg-pressed);
  color: var(--color-text-primary);
}

/* ==========================================================================
   TERTIARY BUTTON - Updated Typography
   ========================================================================== */
.btn--tertiary {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
  text-decoration: underline;
  padding: calc(var(--button-padding-medium-v) * 0.5) calc(var(--button-padding-medium-h) * 0.5);
  font-size: var(--font-size-24); /* 24px */
  line-height: var(--lh-24); /* 24px × 1.3333 = 32px (4 × 8px) */
  font-weight: var(--font-weight-regular);
}

@media (hover: hover) and (pointer: fine) {
  .btn--tertiary:hover:not(.btn--disabled):not(.btn--loading) {
    color: var(--color-brand-primary);
    text-decoration: underline;
  }
}

.btn--tertiary:active:not(.btn--disabled):not(.btn--loading) {
  color: var(--color-brand-hover);
  text-decoration: underline;
}

/* ==========================================================================
   ITINERARY BUTTON - Italic text link style
   ========================================================================== */
.btn--itinerary {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 0;
  min-height: auto;
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-regular);
  font-style: italic;
}

@media (hover: hover) and (pointer: fine) {
  .btn--itinerary:hover:not(.btn--disabled):not(.btn--loading) {
    color: var(--color-brand-primary);
  }
}

.btn--itinerary:active:not(.btn--disabled):not(.btn--loading) {
  color: var(--color-brand-hover);
}

/* ==========================================================================
   SIZE VARIANTS - Updated Typography System
   ========================================================================== */

/* Large Size - Publico Heading Font */
.btn--large {
  font-family: var(--font-heading); /* Publico Headline Light */
  font-size: var(--font-size-28); /* 28px desktop, 20px mobile */
  line-height: var(--lh-28); /* 28px × 1.4286 = 40px (5 × 8px) */
  font-weight: var(--font-weight-light); /* 300 */
  text-transform: uppercase;
  padding: var(--button-padding-large-v) var(--button-padding-large-h);
  min-height: var(--button-height-large);
}

/* Medium Size - Noto Sans Body Font (Default) */
.btn--medium {
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 18px desktop, 16px mobile */
  line-height: var(--lh-18); /* 18px × 1.3333 = 24px (3 × 8px) */
  font-weight: var(--font-weight-regular); /* 400 */
  padding: var(--button-padding-medium-v) var(--button-padding-medium-h);
  min-height: var(--button-height-medium);
}

/* Small Size - Noto Sans Body Font, Compact */
.btn--small {
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 16px desktop, 14px mobile */
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  font-weight: var(--font-weight-regular); /* 400 */
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  min-height: var(--button-height-small);
}

/* ==========================================================================
   DISABLED STATE - Using CSS Variables
   ========================================================================== */
.btn--disabled {
  background: var(--color-surface-disabled) !important;
  border-color: var(--color-surface-disabled) !important;
  color: var(--color-text-disabled) !important;
  cursor: not-allowed !important;
  pointer-events: none;
  text-decoration: none !important;
  transform: none !important;
}

/* Tertiary disabled state - special case */
.btn--tertiary.btn--disabled {
  background: var(--color-surface-disabled) !important;
  border: var(--border-width) solid var(--color-surface-disabled) !important;
}

/* ==========================================================================
   LOADING STATE
   ========================================================================== */
.btn--loading {
  cursor: wait;
  pointer-events: none;
}

/* ==========================================================================
   LINK BEHAVIOR - When tag="a"
   ========================================================================== */
a.btn {
  display: inline-flex;
  text-decoration: none;
}

a.btn:focus {
  text-decoration: none;
}

/* Ensure tertiary links still show underline */
a.btn--tertiary:not(.btn--disabled) {
  text-decoration: underline;
}

a.btn--tertiary:focus:not(.btn--disabled) {
  text-decoration: underline;
}

/* ==========================================================================
   MOBILE RESPONSIVE - Updated Typography
   ========================================================================== */
@media (max-width: 768px) {
  .btn {
    padding: var(--button-padding-medium-v) var(--button-padding-medium-h);
    font-size: var(--font-size-18); /* Uses mobile responsive value (16px) */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }

  .btn--large {
    padding: var(--button-padding-large-v) var(--button-padding-large-h);
    font-size: var(--font-size-28); /* Uses mobile responsive value */
    line-height: var(--lh-20); /* Mobile: 20px × 1.6 = 32px (4 × 8px) */
    min-height: var(--button-height-large);
  }

  .btn--small {
    padding: var(--button-padding-small-v) var(--button-padding-small-h);
    font-size: var(--font-size-18); /* Uses mobile responsive value */
    line-height: var(--lh-14); /* Mobile: 14px × 1.7143 = 24px (3 × 8px) */
    min-height: var(--button-height-small);
  }

  .btn--tertiary {
    font-size: var(--font-size-24); /* Uses mobile responsive value */
    line-height: var(--lh-18); /* Mobile: 18px × 1.3333 = 24px (3 × 8px) */
  }

  .pagination-text {
    font-size: var(--font-size-18); /* Mobile: 14px */
    line-height: var(--lh-14); /* 14px × 1.7143 = 24px (3 × 8px) */
  }

  .pagination-ellipsis {
    font-size: var(--font-size-18); /* Mobile: 16px */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }
}
</style>
