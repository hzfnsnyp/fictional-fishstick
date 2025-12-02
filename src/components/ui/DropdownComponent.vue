<template>
  <div class="custom-dropdown" ref="dropdownRef">
    <label
      v-if="label"
      :id="dropdownLabelId"
      :for="dropdownId"
      class="custom-dropdown-label"
    >
      {{ label }}
    </label>

    <div class="custom-dropdown-wrapper" :style="wrapperStyle">
      <button
        :id="dropdownId"
        type="button"
        class="custom-dropdown-trigger"
        :class="{ 'custom-dropdown-trigger--disabled': disabled }"
        @click="toggleDropdown"
        @keydown="handleTriggerKeydown"
        :disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-labelledby="label ? dropdownLabelId : dropdownId"
        :aria-activedescendant="activeDescendantId"
        :aria-controls="menuId"
        role="combobox"
      >
        <span class="custom-dropdown-text">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>

        <IconComponent
          name="chevron-down"
          class="custom-dropdown-arrow"
          :class="{ 'custom-dropdown-arrow--open': isOpen }"
          aria-hidden="true"
        />
      </button>

      <div
        v-if="isOpen"
        ref="menuRef"
        class="custom-dropdown-menu"
        :class="{ 'custom-dropdown-menu--scrollable': needsScrollbar }"
        role="listbox"
        :aria-labelledby="label ? dropdownLabelId : dropdownId"
        :id="menuId"
        tabindex="-1"
        @keydown="handleMenuKeydown"
      >
        <button
          v-for="(option, index) in options"
          :key="option.value"
          :id="getOptionId(option, index)"
          type="button"
          class="custom-dropdown-item"
          :class="{
            'custom-dropdown-item--selected': option.value === modelValue,
            'custom-dropdown-item--focused': index === focusedIndex,
          }"
          @click="selectOption(option)"
          @mouseenter="focusedIndex = index"
          :tabindex="-1"
          role="option"
          :aria-selected="option.value === modelValue"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
} from "vue";
import { useUniqueId } from "@/composables/useUniqueId";
import IconComponent from "@/components/ui/IconComponent.vue";

export default defineComponent({
  name: "CustomDropdown",
  components: { IconComponent },
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: null,
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => {
        return options.every(
          (option) =>
            typeof option === "object" &&
            option.hasOwnProperty("value") &&
            option.hasOwnProperty("label")
        );
      },
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { id: dropdownId } = useUniqueId("dropdown");
    const dropdownLabelId = `${dropdownId}-label`;
    const menuId = `${dropdownId}-menu`;
    const dropdownRef = ref(null);
    const menuRef = ref(null);
    const isOpen = ref(false);
    const focusedIndex = ref(-1);
    const fixedWidth = ref(null);

    const selectedOption = computed(() => {
      return (
        props.options.find((option) => option.value === props.modelValue) ||
        null
      );
    });

    // Determine if scrollbar is needed based on options count
    const needsScrollbar = computed(() => {
      return props.options.length > 5;
    });

    // Generate stable option IDs based on option values and dropdown ID
    const getOptionId = (option, index) => {
      // Use option value for stability, fallback to index
      const identifier =
        option.value !== undefined
          ? String(option.value).replace(/[^a-zA-Z0-9]/g, "-")
          : index;
      return `${dropdownId}-option-${identifier}`;
    };

    // Active descendant for screen readers
    const activeDescendantId = computed(() =>
      focusedIndex.value >= 0
        ? getOptionId(props.options[focusedIndex.value], focusedIndex.value)
        : null
    );

    const computeFixedWidth = () => {
      // Desktop only
      const isDesktop = window.matchMedia('(min-width: 769px)').matches;
      if (!isDesktop) { fixedWidth.value = null; return; }
      const labels = (props.options || []).map(o => String(o.label ?? ''));
      const longest = labels.reduce((a,b)=> b.length>a.length?b:a, '');
      const probe = document.createElement('span');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.whiteSpace = 'nowrap';
      // Typography matches trigger
      const root = document.documentElement;
      const fontFamily = getComputedStyle(root).getPropertyValue('--font-body') || 'system-ui, sans-serif';
      const fontSize = getComputedStyle(root).getPropertyValue('--font-size-18') || '16px';
      const fontWeight = 500;
      probe.style.fontFamily = fontFamily.replace(/^[\s"']+|[\s"']+$/g,'');
      probe.style.fontSize = fontSize;
      probe.style.fontWeight = String(fontWeight);
      probe.textContent = longest || 'Select';
      document.body.appendChild(probe);
      const textWidth = probe.offsetWidth;
      document.body.removeChild(probe);
      // padding L/R + arrow area + borders (~48 + 48 + 2)
      fixedWidth.value = Math.ceil(textWidth + 98);
    };

    const toggleDropdown = async () => {
      if (props.disabled) return;

      isOpen.value = !isOpen.value;

      if (isOpen.value) {
        // Set initial focus to selected item or first item
        const selectedIndex = props.options.findIndex(
          (option) => option.value === props.modelValue
        );
        focusedIndex.value = selectedIndex >= 0 ? selectedIndex : 0;

        // Focus the menu for keyboard navigation
        await nextTick();
        if (menuRef.value) {
          menuRef.value.focus();
        }
      } else {
        focusedIndex.value = -1;
      }
    };

    const selectOption = (option) => {
      emit("update:modelValue", option.value);
      emit("change", option);
      isOpen.value = false;
      focusedIndex.value = -1;

      // Return focus to trigger
      nextTick(() => {
        const trigger = dropdownRef.value?.querySelector(
          ".custom-dropdown-trigger"
        );
        if (trigger) trigger.focus();
      });
    };

    const selectFocusedOption = () => {
      if (
        focusedIndex.value >= 0 &&
        focusedIndex.value < props.options.length
      ) {
        selectOption(props.options[focusedIndex.value]);
      }
    };

    const handleTriggerKeydown = (event) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen.value) {
            toggleDropdown();
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          toggleDropdown();
          break;
        case "Escape":
          if (isOpen.value) {
            event.preventDefault();
            isOpen.value = false;
            focusedIndex.value = -1;
          }
          break;
      }
    };

    const handleMenuKeydown = (event) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          focusedIndex.value = Math.min(
            focusedIndex.value + 1,
            props.options.length - 1
          );
          scrollToFocusedItem();
          break;
        case "ArrowUp":
          event.preventDefault();
          focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
          scrollToFocusedItem();
          break;
        case "Home":
          event.preventDefault();
          focusedIndex.value = 0;
          scrollToFocusedItem();
          break;
        case "End":
          event.preventDefault();
          focusedIndex.value = props.options.length - 1;
          scrollToFocusedItem();
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectFocusedOption();
          break;
        case "Escape":
          event.preventDefault();
          isOpen.value = false;
          focusedIndex.value = -1;
          // Return focus to trigger
          nextTick(() => {
            const trigger = dropdownRef.value?.querySelector(
              ".custom-dropdown-trigger"
            );
            if (trigger) trigger.focus();
          });
          break;
        case "Tab":
          // Allow tab to close dropdown and move to next element
          isOpen.value = false;
          focusedIndex.value = -1;
          break;
      }
    };

    const scrollToFocusedItem = () => {
      nextTick(() => {
        const focusedOption = props.options[focusedIndex.value];
        const focusedElement = menuRef.value?.querySelector(
          `#${getOptionId(focusedOption, focusedIndex.value)}`
        );
        if (focusedElement && menuRef.value) {
          focusedElement.scrollIntoView({ block: "nearest" });
        }
      });
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
        focusedIndex.value = -1;
      }
    };

    // Watch for menu opening to handle focus
    watch(isOpen, (newValue) => {
      if (!newValue) {
        focusedIndex.value = -1;
      }
    });

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    const wrapperStyle = computed(() => fixedWidth.value ? { width: fixedWidth.value + 'px' } : {});

    onMounted(() => {
      computeFixedWidth();
      window.addEventListener('resize', computeFixedWidth);
    });
    onUnmounted(() => window.removeEventListener('resize', computeFixedWidth));
    watch(() => props.options, computeFixedWidth, { deep: true });

    return {
      dropdownId,
      dropdownLabelId,
      menuId,
      dropdownRef,
      menuRef,
      isOpen,
      focusedIndex,
      wrapperStyle,
      selectedOption,
      needsScrollbar,
      activeDescendantId,
      getOptionId,
      toggleDropdown,
      selectOption,
      handleTriggerKeydown,
      handleMenuKeydown,
    };
  },
});
</script>

<style scoped>
/* ==========================================================================
   DROPDOWN CONTAINER
   ========================================================================== */
.custom-dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-48);
}

/* ==========================================================================
   DROPDOWN LABEL - Updated Typography
   ========================================================================== */
.custom-dropdown-label {
  display: block;
  font-size: var(--font-size-18); /* 16px */
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-16);
}

/* ==========================================================================
   DROPDOWN WRAPPER
   ========================================================================== */
.custom-dropdown-wrapper {
  position: relative;
  max-width: 100%;
}

/* ==========================================================================
   DROPDOWN TRIGGER - Button States (Using Small Button Size)
   ========================================================================== */
.custom-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  font-size: var(--font-size-18); /* 16px */
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  font-family: var(--font-body);
  font-weight: var(--font-weight-regular); /* match Secondary button */
  color: var(--color-text-secondary); /* match Secondary button */
  background: var(--color-surface-primary);
  border: var(--border-width) solid var(--color-text-secondary); /* match Secondary button */
  cursor: pointer;
  transition: var(--transition-normal);
  outline: none;
  min-height: var(--button-height-small);
  box-sizing: border-box;
}

/* Hover State */
@media (hover: hover) and (pointer: fine) {
  .custom-dropdown-trigger:hover:not(:focus-visible):not(.custom-dropdown-trigger--disabled) {
    background: var(--color-surface-secondary);
    border-color: var(--color-surface-secondary);
    color: var(--color-text-primary);
  }
}

/* Disabled State */
.custom-dropdown-trigger--disabled {
  background: var(--color-surface-disabled) !important;
  color: var(--color-text-disabled) !important;
  border-color: var(--color-surface-disabled) !important;
  cursor: not-allowed !important;
}

/* ==========================================================================
   DROPDOWN TEXT AND ARROW
   ========================================================================== */
.custom-dropdown-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
}

.custom-dropdown-arrow {
  width: var(--icon-lg); /* 24px desktop */
  height: var(--icon-lg);
  margin-left: var(--spacing-20);
  transition: transform var(--transition-normal);
  flex-shrink: 0;
}

.custom-dropdown-arrow--open {
  transform: rotate(180deg);
}

.custom-dropdown-trigger--disabled .custom-dropdown-arrow {
  opacity: 0.3;
}

/* Desktop icon sizes */
.custom-dropdown-arrow { width: var(--icon-lg); height: var(--icon-lg); margin-left: var(--spacing-20); }

/* ==========================================================================
   DROPDOWN MENU - Dynamic Height Based on Item Count
   ========================================================================== */
.custom-dropdown-menu {
  position: absolute;
  top: calc(100% + var(--spacing-16));
  left: 0;
  right: 0;
  background: var(--color-surface-primary);
  border: var(--border-width) solid var(--color-border-default);
  z-index: 1000;
  overflow-y: auto;
  outline: none;
}

/* When 6+ items, enable scrolling */
.custom-dropdown-menu--scrollable {
  max-height: calc(var(--button-height-small) * 5); /* 5 items × small button height */
}

/* ==========================================================================
   DROPDOWN ITEMS - Updated Typography
   ========================================================================== */
.custom-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
  font-size: var(--font-size-18); /* 18px */
  line-height: var(--lh-18); /* 18px × 1.3333 = 24px (3 × 8px) */
  font-family: var(--font-body);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-normal);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  min-height: var(--button-height-small);
  box-sizing: border-box;
  outline: none;
}

/* Keyboard focus state */
.custom-dropdown-item--focused {
  background: var(--color-surface-secondary);
}

/* Hover State */
@media (hover: hover) and (pointer: fine) {
  .custom-dropdown-item:hover:not(.custom-dropdown-item--focused) {
    background: var(--color-surface-secondary);
  }
}

/* Selected State */
.custom-dropdown-item--selected {
  color: var(--color-brand-primary);
  font-weight: var(--font-weight-medium);
}

/* ==========================================================================
   DROPDOWN CHECKMARK - Aligned with Chevron
   ========================================================================== */
.custom-dropdown-check {
  width: var(--icon-lg); /* 24px desktop */
  height: var(--icon-lg);
  opacity: 1;
  transition: opacity var(--transition-normal);
  flex-shrink: 0;
  margin-left: var(--spacing-16);
}

/* ==========================================================================
   MOBILE RESPONSIVE
   ========================================================================== */
@media (max-width: 768px) {
  .custom-dropdown-label {
    font-size: var(--font-size-18); /* 16px */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }

  .custom-dropdown-trigger {
    padding: var(--button-padding-small-v) var(--button-padding-small-h);
    font-size: var(--font-size-18); /* 16px */
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
    min-height: var(--button-height-small);
  }

  .custom-dropdown-text {
    line-height: var(--lh-16); /* 16px × 1.5 = 24px (3 × 8px) */
  }

  .custom-dropdown-item {
    padding: var(--button-padding-small-v) var(--button-padding-small-h);
    font-size: var(--font-size-18); /* 18px → 16px on mobile via CSS variables */
    line-height: var(--lh-16); /* Mobile responsive line-height */
    min-height: var(--button-height-small);
  }

  .custom-dropdown-arrow { width: var(--icon-xl); height: var(--icon-xl); }
  .custom-dropdown-check { width: var(--icon-xl); height: var(--icon-xl); }

  .custom-dropdown-menu--scrollable {
    max-height: calc(var(--button-height-small) * 5); /* Auto-scales with mobile button height */
  }
}
</style>
