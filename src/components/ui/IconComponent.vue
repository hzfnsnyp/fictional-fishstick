<template>
  <svg
    :class="['icon', `icon--${name}`, className]"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Chevron Down (centered @12,12) -->
    <path
      v-if="name === 'chevron-down'"
      d="M8 10l4 4 4-4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Chevron Up -->
    <path
      v-if="name === 'chevron-up'"
      d="M8 14l4-4 4 4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Chevron Right -->
    <path
      v-if="name === 'chevron-right'"
      d="M10 8l4 4-4 4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Chevron Left -->
    <path
      v-if="name === 'chevron-left'"
      d="M14 8l-4 4 4 4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Check -->
    <path
      v-if="name === 'check'"
      d="M6 12l3 3 9-9"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Arrow Right -->
    <g
      v-if="name === 'arrow-right'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M10 8l4 4-4 4" />
      <path d="M6 12h8" />
    </g>

    <!-- Arrow Left -->
    <g
      v-if="name === 'arrow-left'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M14 8l-4 4 4 4" />
      <path d="M18 12H10" />
    </g>

    <!-- Search -->
    <g
      v-if="name === 'search'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20 15.65 15.65" />
    </g>

    <!-- Menu Hamburger -->
    <g
      v-if="name === 'menu-hamburger'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 7h12" />
      <path d="M6 12h12" />
      <path d="M6 17h12" />
    </g>

    <!-- Menu -->
    <g
      v-if="name === 'menu'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 8h12" />
      <path d="M8 11h8" />
      <path d="M10 14h4" />
    </g>

    <!-- Cross/Close -->
    <g
      v-if="name === 'cross'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </g>

    <!-- Zoom In (Plus) -->
    <g
      v-if="name === 'zoom-in'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </g>

    <!-- Zoom Out (Minus) -->
    <g
      v-if="name === 'zoom-out'"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 12h14" />
    </g>
  </svg>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconComponent",
  props: {
    name: {
      type: String,
      required: true,
      validator: (value) =>
        [
          "chevron-down",
          "chevron-up",
          "chevron-right",
          "chevron-left",
          "check",
          "arrow-right",
          "arrow-left",
          "search",
          "menu-hamburger",
          "menu",
          "cross",
          "zoom-in",
          "zoom-out",
        ].includes(value),
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    className: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped>
.icon {
  display: inline-block;
  color: currentColor;
  transition: color var(--transition-normal);
  vertical-align: middle;
}

/* Ensure visible stroke weight across all icons */
.icon * {
  stroke-width: 1.2;
}

/* Размеры по умолчанию */
.icon--small {
  width: 16px;
  height: 16px;
}

.icon--medium {
  width: 20px;
  height: 20px;
}

.icon--large {
  width: 24px;
  height: 24px;
}

.icon--xl {
  width: 32px;
  height: 32px;
}
</style>
