<template>
  <div class="artwork-filter">
    <!-- Top controls: results on left, Filters button + sort dropdown on right -->
    <div class="sorting-controls">
      <div
        class="results-info"
        :class="{ 'results-info--with-filters': hasActiveFilters }"
        role="status"
        aria-live="polite"
      >
        {{ resultsHeading }}
      </div>
      <div class="right-controls">
        <div class="sort-dropdown">
          <DropdownComponent
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sort"
            @change="onSortChange"
          />
        </div>

        <ButtonComponent
          variant="secondary"
          size="small"
          tag="button"
          @click="openDrawer"
          :aria-expanded="isDrawerOpen"
          aria-controls="artwork-filter-drawer"
        >
          Filters
        </ButtonComponent>
      </div>
    </div>

    <!-- Applied chips (moved below the top controls) -->
    <div
      class="applied-filters"
      :class="{
        'applied-filters--visible': hasActiveFilters,
        'applied-filters--hidden': !hasActiveFilters,
      }"
      :aria-hidden="!hasActiveFilters"
      :inert="!hasActiveFilters"
    >
      <template v-if="hasActiveFilters">
        <div class="applied-filters-header">
          <ClickableTextComponent
            action-type="action"
            class="clear-all-text"
            @click="clearAllFilters"
          >
            Clear All
          </ClickableTextComponent>
        </div>
        <div class="filter-chips">
          <FilterChip
            v-for="(filter, index) in activeFilters"
            :key="`${filter.type}-${filter.value}`"
            :label="filter.label"
            @remove="removeFilter(index)"
          />
        </div>
      </template>
    </div>
  </div>

  <!-- Drawer overlay / panel -->
  <div
    class="drawer-overlay"
    :class="{ 'drawer-overlay--visible': isDrawerOpen }"
    :inert="!isDrawerOpen"
    @click="closeDrawer"
  />
  <aside
    id="artwork-filter-drawer"
    class="filter-drawer"
    :class="{ 'filter-drawer--open': isDrawerOpen }"
    :inert="!isDrawerOpen"
    role="dialog"
    aria-modal="true"
    aria-label="Artwork filters"
    @click.stop
  >
    <header class="drawer-header">
      <h2 class="drawer-title">Filters</h2>
      <ButtonComponent
        variant="secondary"
        size="small"
        class="drawer-close"
        @click="closeDrawer"
        aria-label="Close filters"
      >
        <IconComponent name="cross" :size="24" />
      </ButtonComponent>
    </header>
    <div class="drawer-content">
      <fieldset class="filter-group">
        <legend class="filter-legend">Availability</legend>
        <SwitchComponent
          v-model="filters.availability"
          label="Only Available"
          @update:modelValue="updateFilters"
        />
      </fieldset>

      <fieldset class="filter-group">
        <legend class="filter-legend">Year</legend>
        <FilterChecklist
          v-model="filters.years"
          :options="yearOptions"
          :columns="4"
          aria-label="Years"
          @change="updateFilters"
        />
      </fieldset>

      <fieldset class="filter-group">
        <legend class="filter-legend">Series</legend>
        <FilterChecklist
          v-model="filters.series"
          :options="seriesOptions"
          :allow-all="true"
          aria-label="Series"
          @change="updateFilters"
        />
      </fieldset>

      <fieldset class="filter-group">
        <legend class="filter-legend">Size</legend>
        <FilterChecklist
          v-model="filters.sizes"
          :options="sizeOptions"
          aria-label="Sizes"
          @change="updateFilters"
        />
      </fieldset>

      <fieldset class="filter-group medium-select-container">
        <legend class="filter-legend">Medium</legend>
        <FilterChecklist
          v-model="filters.mediums"
          :options="mediumOptions"
          :centered="true"
          aria-label="Mediums"
          @change="updateFilters"
        />
      </fieldset>
    </div>
    <div class="drawer-footer">
      <ButtonComponent variant="primary" size="small" @click="applyAndClose"
        >Apply ({{ filteredResultsCount }} results)</ButtonComponent
      >
      <ButtonComponent variant="secondary" size="small" @click="clearAllFilters"
        >Reset</ButtonComponent
      >
    </div>
  </aside>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import ClickableTextComponent from "@/components/ui/ClickableTextComponent.vue";
import DropdownComponent from "@/components/ui/DropdownComponent.vue";
import IconComponent from "@/components/ui/IconComponent.vue";
import FilterChip from "@/components/ui/FilterChip.vue";
import SwitchComponent from "@/components/ui/SwitchComponent.vue";
import ButtonComponent from "@/components/ui/ButtonComponent.vue";
import FilterChecklist from "@/components/ui/FilterChecklist.vue";

export default defineComponent({
  name: "ArtworkFilterPanel",
  components: {
    ClickableTextComponent,
    DropdownComponent,
    IconComponent,
    FilterChip,
    ButtonComponent,
    FilterChecklist,
    SwitchComponent,
  },
  props: {
    initialFilters: { type: Object, default: () => ({}) },
    yearOptions: { type: Array, default: () => [] },
    seriesOptions: { type: Array, default: () => [] },
    mediumOptions: { type: Array, default: () => [] },
    sizeOptions: { type: Array, default: () => [] },
    resultsCount: { type: Number, default: null },
  },
  emits: ["filters-changed", "sort-changed"],
  setup(props, { emit }) {
    const filters = ref({
      years: [],
      series: [],
      sizes: [],
      availability: false,
      mediums: [],
    });
    const sortBy = ref("year-desc");
    const isDrawerOpen = ref(false);
    const filteredResultsCount = computed(() =>
      typeof props.resultsCount === "number" ? props.resultsCount : 0
    );
    let lockedScrollY = 0;
    let previouslyFocusedElement = null;

    const sortOptions = [
      { value: "year-desc", label: "Newest First" },
      { value: "year-asc", label: "Oldest First" },
      { value: "size-desc", label: "Largest First" },
      { value: "size-asc", label: "Smallest First" },
      { value: "recent", label: "Recently Added" },
      { value: "alphabetical", label: "Alphabetical" },
    ];

    const yearOptions = computed(() => props.yearOptions);
    const seriesOptions = computed(() => props.seriesOptions);
    const sizeOptions = computed(() =>
      props.sizeOptions.length
        ? props.sizeOptions
        : [
            { value: "small", label: "Small (under 60 cm)" },
            { value: "medium", label: "Medium (60–120 cm)" },
            { value: "large", label: "Large (120+ cm)" },
          ]
    );
    const mediumOptions = computed(() => props.mediumOptions);

    const activeFilters = computed(() => {
      const active = [];
      filters.value.years.forEach((y) =>
        active.push({ type: "year", value: y, label: y })
      );
      filters.value.series.forEach((s) => {
        const found = (seriesOptions.value || seriesOptions).find((o) => o.value === s);
        active.push({ type: "series", value: s, label: found?.label || s });
      });
      filters.value.sizes.forEach((sz) =>
        active.push({ type: "size", value: sz, label: sz })
      );
      if (filters.value.availability)
        active.push({
          type: "availability",
          value: "available",
          label: "Available",
        });
      filters.value.mediums.forEach((m) => {
        const found = mediumOptions.find((o) => o.value === m);
        active.push({ type: "medium", value: m, label: found?.label || m });
      });
      return active;
    });

    const hasActiveFilters = computed(() => activeFilters.value.length > 0);
    const activeFilterCount = computed(() => activeFilters.value.length);
    const singleSeriesLabel = computed(() => {
      const series = filters.value.series;
      if (series.length === 1) {
        const found = (seriesOptions.value || seriesOptions).find((o) => o.value === series[0]);
        return found?.label || series[0];
      }
      return null;
    });
    const resultsHeading = computed(() => {
      const c = filteredResultsCount.value;
      const base = `${c} ${c === 1 ? "artwork" : "artworks"} `;
      if (!hasActiveFilters.value) return `${base}found`;
      // if exactly one series is selected and no other filters are active
      const otherFiltersCount = activeFilters.value.filter(
        (f) => f.type !== "series"
      ).length;
      if (singleSeriesLabel.value && otherFiltersCount === 0) {
        return `${base}in ${singleSeriesLabel.value}`;
      }
      return `${base}found with applied filters`;
    });

    const lockScroll = () => {
      lockedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    };
    const unlockScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, lockedScrollY);
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevBehavior || "";
      });
    };
    // Get all focusable elements within the drawer
    const getFocusableElements = () => {
      const drawer = document.getElementById("artwork-filter-drawer");
      if (!drawer) return [];

      const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ];

      return Array.from(drawer.querySelectorAll(focusableSelectors.join(', ')))
        .filter(el => el.offsetParent !== null); // Only visible elements
    };

    const openDrawer = () => {
      // Save currently focused element for restoration
      previouslyFocusedElement = document.activeElement;
      isDrawerOpen.value = true;
      lockScroll();

      // Set focus to first focusable element in drawer
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 100); // Small delay to ensure drawer is rendered
    };

    const closeDrawer = () => {
      isDrawerOpen.value = false;
      unlockScroll();
      // Restore focus to the element that opened the drawer
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
        previouslyFocusedElement = null;
      }
    };

    const onKeydown = (e) => {
      if (e.key === "Escape" && isDrawerOpen.value) {
        closeDrawer();
        return;
      }

      // Focus trap: handle Tab and Shift+Tab
      if (e.key === "Tab" && isDrawerOpen.value) {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab: if on first element, go to last
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        }
        // Tab: if on last element, go to first
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const updateFilters = () => {
      emit("filters-changed", {
        filters: { ...filters.value },
        activeFilters: activeFilters.value,
      });
    };
    const removeFilter = (index) => {
      const f = activeFilters.value[index];
      if (f.type === "year")
        filters.value.years = filters.value.years.filter((y) => y !== f.value);
      else if (f.type === "series")
        filters.value.series = filters.value.series.filter(
          (s) => s !== f.value
        );
      else if (f.type === "size")
        filters.value.sizes = filters.value.sizes.filter((s) => s !== f.value);
      else if (f.type === "availability") filters.value.availability = false;
      else if (f.type === "medium")
        filters.value.mediums = filters.value.mediums.filter(
          (m) => m !== f.value
        );
      updateFilters();
    };
    const clearAllFilters = () => {
      filters.value = {
        years: [],
        series: [],
        sizes: [],
        availability: false,
        mediums: [],
      };
      updateFilters();
    };
      const onSortChange = (option) =>
        emit("sort-changed", { sortBy: option.value, sortLabel: option.label });

    if (props.initialFilters)
      Object.assign(filters.value, props.initialFilters);
    watch(filters, updateFilters, { deep: true });
    onMounted(() => {
      window.addEventListener("keydown", onKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener("keydown", onKeydown);
      unlockScroll();
    });

    return {
      filters,
      sortBy,
      isDrawerOpen,
      sortOptions,
      yearOptions,
      seriesOptions,
      sizeOptions,
      mediumOptions,
      activeFilters,
      hasActiveFilters,
      activeFilterCount,
      resultsHeading,
      openDrawer,
      closeDrawer,
      applyAndClose: () => {
        updateFilters();
        closeDrawer();
      },
      updateFilters,
      removeFilter,
      clearAllFilters,
      onSortChange,
      filteredResultsCount,
    };
  },
});
</script>

<style scoped>
/* Container */
.artwork-filter {
  width: 100%;
  max-width: none;
  margin: 0 auto;
}

/* Heading */
.heading-primary {
  font-family: var(--font-heading);
  font-size: var(--font-size-60);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-128);
  color: var(--color-text-secondary);
}

/* Applied */
.applied-filters {
  margin-bottom: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: max-height var(--transition-normal),
    margin-bottom var(--transition-normal), opacity var(--transition-normal);
}
.applied-filters--visible {
  margin-bottom: var(--spacing-48);
  max-height: 480px;
  opacity: 1;
  pointer-events: auto;
}
.applied-filters--hidden {
  margin-bottom: 0;
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}
.applied-filters-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--spacing-32);
}
.applied-filters-label,
.clear-all-text {
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}
/* Results heading in Publico 28, no italics */
.results-info {
  font-family: var(--font-body);
  font-size: var(--font-size-18); /* 18px */
  font-style: normal;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
}
.results-info.results-info--with-filters {
  /* filters applied variant */
}
/* Soften Clear All appearance */
.clear-all-text {
  text-transform: none;
  font-weight: var(--font-weight-regular);
  opacity: 0.8;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-16);
}
@media (hover: hover) and (pointer: fine) {
  .clear-all-text:hover {
    text-decoration: underline;
    opacity: 1;
  }
}
.clear-all-icon {
  display: none;
}
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-20);
}

/* Top controls */
.sorting-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-32);
}
.right-controls {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-32);
}
/* Ensure dropdown trigger and button share identical height */
.right-controls .custom-dropdown-trigger {
  min-height: var(--button-height-small);
}
.right-controls .btn {
  min-height: var(--button-height-small);
}
.filter-toggle {
  width: max-content;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-32);
  color: var(--color-text-primary);
}
.filter-title {
  font-size: var(--font-size-24);
}
/* filter-count badge removed — chips indicate active filters */
.filter-icon {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

/* Align dropdown and button heights; remove extra bottom margin */
.sort-dropdown .custom-dropdown {
  margin-bottom: 0;
}

/* Remove any label styles for sort; label not used */

/* Drawer */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-surface-primary);
  opacity: 0;
  visibility: hidden;
  transition: visibility var(--transition-fast), opacity var(--transition-fast);
  z-index: var(--z-modal); /* above header; below/with drawer */
  overscroll-behavior: contain;
}
.drawer-overlay--visible {
  visibility: visible;
  opacity: 1;
}
.filter-drawer {
  position: fixed;
  top: 0;
  right: -520px;
  width: min(520px, 95vw);
  height: 100vh;
  background: var(--color-surface-primary);
  box-shadow: none; /* remove shadow */
  border-left: var(--border-width) solid var(--color-border-subtle); /* subtle vertical line */
  transition: right var(--transition-normal);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* only content area scrolls */
  touch-action: none; /* prevent gestures from bubbling to page */
}
.filter-drawer--open {
  right: 0;
}
.drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding-inline: var(--site-gutter-x);
  border-bottom: var(--border-width) solid var(--color-border-subtle);
  flex: 0 0 auto; /* fixed header height; don't scroll */
}

.drawer-title {
  grid-column: 2;
  justify-self: flex-start;
  align-self: center; /* Добавляем вертикальное центрирование */
  font-family: var(--font-heading-light);
  font-size: var(--font-size-24);
  line-height: var(--lh-24);
  font-weight: var(--font-weight-light);
  margin: 0; /* Убираем margin-top */
  height: var(--header-height); /* Явно задаем высоту */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.drawer-close.btn {
  grid-column: 3;
  justify-self: end;
  align-self: center;
  min-width: var(--button-height-small) !important;
  min-height: var(--button-height-small) !important;
  width: var(--button-height-small) !important;
  height: var(--button-height-small) !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: none !important;
  background: transparent !important;
}

.drawer-close.btn svg {
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

@media (hover: hover) and (pointer: fine) {
  .drawer-close.btn:hover svg {
    color: var(--color-brand-primary);
  }
}

.drawer-close.btn:active svg {
  color: var(--color-interactive-pressed);
}
.drawer-content {
  padding: var(--spacing-48);
  overflow: auto;
  flex: 1 1 auto;
  display: grid;
  gap: var(--spacing-32);
  -webkit-overflow-scrolling: touch; /* smooth inertial scroll on iOS */
  overscroll-behavior: contain; /* prevent body scroll chaining */
}
.drawer-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-20);
  padding: var(--spacing-32) var(--spacing-48)
    calc(env(safe-area-inset-bottom) + var(--spacing-32));
  border-top: var(--border-width) solid var(--color-border-subtle);
  flex: 0 0 auto; /* keep buttons anchored at bottom */
}

/* Fieldsets */
.filter-group {
  border: none;
  padding: 0;
  margin: 0;
  overflow: visible; /* prevent focus ring clipping */
}
.filter-legend {
  font-family: var(--font-body);
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-16);
  display: block;
}
.medium-select-container {
  margin-top: 0;
}

/* Preview */
.artwork-grid-preview {
  height: 400px;
  background: var(--color-surface-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  margin-top: var(--spacing-64);
  font-style: italic;
}

@media (max-width: 768px) {
  .artwork-filter {
    padding: var(--spacing-64) var(--spacing-32) var(--spacing-96);
  }
  .heading-primary {
    font-size: var(--font-size-46);
    margin-bottom: var(--spacing-96);
  }
  /* Stack heading and controls; keep button + dropdown on one line */
  .sorting-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-20);
  }
  .results-info {
    order: 0;
  }
  .right-controls {
    order: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-20);
  }
  .right-controls > .sort-dropdown {
    flex: 1 1 auto;
  }
  .right-controls > button,
  .right-controls > .btn {
    flex: 0 0 auto;
  }

  .sort-dropdown {
    display: block;
  }
  .artwork-grid-preview {
    height: 300px;
  }
}

/* Mobile sizing parity with header toggle */
@media (max-width: 640px) {
  /* Make drawer full-screen on phones using transform */
  .filter-drawer {
    width: 100vw;
    height: 100dvh;
    left: 0;
    right: auto;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }
  .filter-drawer--open {
    transform: translateX(0);
  }
}
</style>
