<template>
  <div
    class="collapsible-section"
    :class="[
      `collapsible-section--${variant}`,
      { 'collapsible-section--expanded': isExpanded },
    ]"
    :style="{ maxWidth: maxWidth }"
  >
    <!-- Toggle Button - Clean minimal style -->
    <button
      :id="toggleId"
      class="collapsible-section__toggle"
      @click="toggle"
      :aria-expanded="isExpanded"
      :aria-controls="contentId"
    >
      <span class="collapsible-section__title">{{ title }}</span>
      <span class="collapsible-section__icon">
        <!-- Use ready-made System UIcons -->
        <IconComponent
          :name="isExpanded ? 'chevron-up' : 'chevron-down'"
          :size="32"
          class="collapsible-section__chevron"
        />
      </span>
    </button>

    <!-- Content Area -->
    <div
      v-show="isExpanded"
      :id="contentId"
      class="collapsible-section__content"
      :aria-labelledby="toggleId"
    >
      <div class="collapsible-section__content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useUniqueId } from "@/composables/useUniqueId";
import IconComponent from "@/components/ui/IconComponent.vue";

export default defineComponent({
  components: { IconComponent },
  name: "CollapsibleSection",
  props: {
    title: {
      type: String,
      required: true,
    },
    defaultExpanded: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "default",
      validator: (value) => ["default", "compact", "large"].includes(value),
    },
    maxWidth: {
      type: String,
      default: "100%",
    },
  },
  emits: ["toggle", "expand", "collapse"],
  setup(props, { emit }) {
    const isExpanded = ref(props.defaultExpanded);

    // Generate unique IDs for accessibility
    const { id: toggleId } = useUniqueId("collapsible-toggle");
    const { id: contentId } = useUniqueId("collapsible-content");

    const toggle = () => {
      isExpanded.value = !isExpanded.value;
      emit("toggle", isExpanded.value);

      if (isExpanded.value) {
        emit("expand");
      } else {
        emit("collapse");
      }
    };

    return {
      isExpanded,
      toggleId,
      contentId,
      toggle,
    };
  },
});
</script>

<style scoped>
/* ==========================================================================
   COLLAPSIBLE SECTION COMPONENT - Updated Typography
   ========================================================================== */
.collapsible-section {
  width: 100%;
  background: var(--color-surface-primary);
  border-top: 1px solid var(--color-border-subtle); /* Only top divider */
}

/* ==========================================================================
   TOGGLE BUTTON - Updated Typography
   ========================================================================== */
.collapsible-section__toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none; /* No background */
  border: none;
  padding: var(--button-padding-medium-v) 0; /* Medium button padding vertically, no horizontal */
  font-family: var(--font-body);
  font-size: var(--font-size-18); /* 18px like medium dropdown */
  line-height: var(--lh-18); /* 18px × 1.3333 = 24px (3 × 8px) */
  font-weight: 400; /* Regular */
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
  transition: color var(--transition-normal);
  position: relative;
  min-height: var(--button-height-medium); /* Medium button height */
}

@media (hover: hover) and (pointer: fine) {
  .collapsible-section__toggle:hover {
    color: var(--color-brand-primary); /* Red like menu */
  }
}

.collapsible-section__toggle:active {
  color: var(--color-brand-hover); /* Darker red on press */
}

/* Hide focus ring on mouse click, show only on keyboard navigation */
.collapsible-section__toggle:focus {
  outline: none; /* Remove outline on mouse click */
}

.collapsible-section__toggle:focus-visible {
  outline: 2px solid var(--color-brand-primary); /* Show only on keyboard navigation */
  outline-offset: 2px;
}

/* ==========================================================================
   TITLE AND CHEVRON ICON
   ========================================================================== */
.collapsible-section__title {
  flex: 1;
  text-transform: none;
  line-height: var(--lh-18); /* 18px × 1.3333 = 24px (3 × 8px) */
}

.collapsible-section__icon {
  flex-shrink: 0;
  margin-left: var(--spacing-20); /* 24px from text */
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapsible-section__chevron {
  width: var(--icon-xl); /* Desktop 32px */
  height: var(--icon-xl);
  color: var(--color-text-secondary);
  transition: color var(--transition-normal);
}

@media (hover: hover) and (pointer: fine) {
  .collapsible-section__toggle:hover .collapsible-section__chevron {
    color: var(--color-brand-primary); /* Red on hover */
  }
}

.collapsible-section__toggle:active .collapsible-section__chevron {
  color: var(--color-brand-hover); /* Darker red on active */
}

/* ==========================================================================
   CONTENT AREA - Medium dropdown spacing
   ========================================================================== */
.collapsible-section__content {
  background: var(--color-surface-primary);
  /* No top border */
}

.collapsible-section__content-inner {
  padding: var(--button-padding-medium-v) 0; /* Medium button padding vertically */
}

.collapsible-section__content-inner > *:first-child {
  margin-top: 0;
}

.collapsible-section__content-inner > *:last-child {
  margin-bottom: 0;
}

/* ==========================================================================
   VARIANT STYLES - Updated Typography
   ========================================================================== */

/* Compact variant */
.collapsible-section--compact .collapsible-section__toggle {
  padding: var(--button-padding-small-v) 0; /* Small button padding */
  font-size: var(--font-size-18); /* 16px */
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  min-height: var(--button-height-small);
}

.collapsible-section--compact .collapsible-section__title {
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
}

.collapsible-section--compact .collapsible-section__icon {
  margin-left: var(--spacing-20); /* 24px */
}

.collapsible-section--compact .collapsible-section__chevron {
  width: var(--icon-lg); /* Small icon - 24px desktop, 20px mobile */
  height: var(--icon-lg);
}

.collapsible-section--compact .collapsible-section__content-inner {
  padding: var(--button-padding-small-v) 0; /* Small button padding */
}

/* Large variant */
.collapsible-section--large .collapsible-section__toggle {
  padding: var(--button-padding-large-v) 0; /* Large button padding */
  font-size: var(--font-size-28); /* 28px */
  line-height: var(--lh-28); /* 28px × 1.4286 = 40px (5 × 8px) */
  min-height: var(--button-height-large);
}

.collapsible-section--large .collapsible-section__title {
  line-height: var(--lh-28); /* 28px × 1.4286 = 40px (5 × 8px) */
}

.collapsible-section--large .collapsible-section__icon {
  margin-left: var(--spacing-48); /* 48px */
}

.collapsible-section--large .collapsible-section__chevron {
  width: var(--icon-lg); /* Desktop 24px */
  height: var(--icon-lg);
}

.collapsible-section--large .collapsible-section__content-inner {
  padding: var(--button-padding-large-v) 0; /* Large button padding */
}

/* ==========================================================================
   RESPONSIVE DESIGN - Updated Typography
   ========================================================================== */

/* Tablet adjustments */
@media (max-width: 1023px) {
  .collapsible-section__toggle {
    padding: var(--button-padding-medium-v) 0; /* Same as desktop medium */
    font-size: var(--font-size-18); /* 18px → 16px on tablets */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
    min-height: var(--button-height-medium);
  }

  .collapsible-section__title {
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }

  .collapsible-section__icon {
    margin-left: var(--spacing-20); /* 24px */
  }

  .collapsible-section__chevron {
    width: var(--icon-xl); /* Tablet/phone larger */
    height: var(--icon-xl);
  }

  .collapsible-section__content-inner {
    padding: var(--button-padding-medium-v) 0;
  }
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .collapsible-section__toggle {
    padding: var(--button-padding-medium-v) 0; /* Same padding */
    font-size: var(--font-size-18); /* 16px on mobile */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
    min-height: var(--button-height-medium);
  }

  .collapsible-section__title {
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }

  .collapsible-section__icon {
    margin-left: var(--spacing-20); /* 24px */
  }

  .collapsible-section__chevron {
    width: var(--icon-xl); /* Mobile larger per spec */
    height: var(--icon-xl);
  }

  .collapsible-section__content-inner {
    padding: var(--button-padding-medium-v) 0;
  }
}

/* ==========================================================================
   SIMPLE ANIMATIONS
   ========================================================================== */
.collapsible-section__content {
  transition: all var(--transition-normal);
}

/* ==========================================================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  .collapsible-section__toggle,
  .collapsible-section__chevron,
  .collapsible-section__content {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .collapsible-section {
    border-top-width: 2px;
  }

  .collapsible-section__toggle:focus-visible {
    outline-width: 3px;
  }
}
</style>


