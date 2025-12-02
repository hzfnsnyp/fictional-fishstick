<template>
  <nav class="breadcrumbs" :aria-label="ariaLabel">
    <ol class="breadcrumbs__list">
      <li
        v-for="(item, index) in computedItems"
        :key="index"
        class="breadcrumbs__item"
      >
        <template v-if="item.__ellipsis">
          <span class="breadcrumbs__ellipsis" aria-hidden="true">…</span>
        </template>
        <template v-else>
          <component
            :is="linkTag(item, isLast(index))"
            v-bind="linkProps(item, isLast(index))"
            :class="['breadcrumbs__link', { 'is-current': isLast(index) }]"
            :aria-current="isLast(index) ? 'page' : undefined"
          >
            <slot name="item" :item="item" :is-last="isLast(index)">
              {{ item.label }}
            </slot>
          </component>

          <span
            v-if="!isLast(index)"
            class="breadcrumbs__separator"
            aria-hidden="true"
          >
            <slot name="separator">
              <template v-if="separator">
                {{ separator }}
              </template>
              <template v-else>
                <IconComponent name="arrow-right" class="breadcrumbs__icon" />
              </template>
            </slot>
          </span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script>
import { defineComponent, computed } from "vue";
import { RouterLink } from "vue-router";
import IconComponent from "@/components/ui/IconComponent.vue";

export default defineComponent({
  name: "BreadcrumbsComponent",
  components: { IconComponent, RouterLink },
  props: {
    // [{ label: String, to?: RouteLocationRaw, href?: String }]
    items: {
      type: Array,
      required: true,
      validator: (arr) =>
        Array.isArray(arr) && arr.every((it) => typeof it?.label === "string"),
    },
    ariaLabel: {
      type: String,
      default: "Breadcrumb",
    },
    separator: {
      type: String,
      default: "›",
    },
    // Collapse to: first … last when items exceed threshold
    collapseThreshold: {
      type: Number,
      default: 5,
    },
    // Force plain anchors even if `to` provided
    disableRouter: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isLast = (index) => index === computedItems.value.length - 1;

    const computedItems = computed(() => {
      const list = props.items || [];
      if (list.length <= props.collapseThreshold || list.length <= 3)
        return list;
      // Always show first and last; collapse middle
      return [list[0], { __ellipsis: true }, list[list.length - 1]];
    });

    const linkTag = (item, last) => {
      if (last) return "span";
      if (
        !props.disableRouter &&
        Object.prototype.hasOwnProperty.call(item, "to") &&
        item.to
      )
        return RouterLink;
      if (item.href) return "a";
      return "span";
    };

    const linkProps = (item, last) => {
      if (last) return { tabindex: -1 };
      if (
        !props.disableRouter &&
        Object.prototype.hasOwnProperty.call(item, "to") &&
        item.to
      )
        return { to: item.to };
      if (item.href) return { href: item.href };
      return { role: "link" };
    };

    return {
      computedItems,
      isLast,
      linkTag,
      linkProps,
    };
  },
});
</script>

<style scoped>
/* Container */
.breadcrumbs {
  display: block;
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  gap: 0; /* spacing is controlled by separator to keep symmetry */
  flex-wrap: wrap; /* allow wrapping by items */
  row-gap: calc(var(--spacing-8) / 2); /* extra-tight vertical gap on wrap */
  padding: 0;
  margin: 0;
  list-style: none;
}

.breadcrumbs__item { display: inline-flex; align-items: center; white-space: nowrap; }

/* Links */
.breadcrumbs__link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: var(--font-size-18); /* smaller than body */
  line-height: var(--lh-16);
  transition: color var(--transition-normal);
}

@media (hover: hover) and (pointer: fine) {
  .breadcrumbs__link:hover {
    color: var(--color-text-primary);
  }
}
.breadcrumbs__link.is-current {
  color: var(--color-text-primary);
  cursor: default;
  pointer-events: none;
}

/* Separator */
.breadcrumbs__separator {
  display: inline-flex;
  margin-inline: var(--spacing-8);
  color: var(--color-text-muted, var(--color-text-secondary));
}
.breadcrumbs__icon {
  width: var(--icon-md);
  height: var(--icon-md);
}

/* Ellipsis */
.breadcrumbs__ellipsis {
  color: var(--color-text-secondary);
  font-size: var(--font-size-18);
  line-height: var(--lh-16);
  user-select: none;
}

/* Responsive */
@media (max-width: 768px) {
  .breadcrumbs__link,
  .breadcrumbs__ellipsis {
    font-size: var(--font-size-14);
    line-height: var(--lh-14);
  }
}
</style>
