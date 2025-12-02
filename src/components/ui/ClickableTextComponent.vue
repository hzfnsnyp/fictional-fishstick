<template>
  <RouterLink
    v-if="isNavigation && hasRouterLink"
    :to="to"
    custom
    v-slot="{ href, navigate }"
  >
    <a
      :href="href"
      :class="classes"
      :aria-label="ariaLabel || null"
      :aria-describedby="ariaDescribedby || null"
      :aria-disabled="disabled ? 'true' : null"
      :tabindex="disabled ? -1 : null"
      @click="(event) => handleClick(event, navigate)"
      @keydown="(event) => handleKeydown(event, navigate)"
    >
      <slot />
    </a>
  </RouterLink>

  <a
    v-else-if="isNavigation"
    :href="href"
    :class="classes"
    :target="external ? '_blank' : null"
    :rel="external ? 'noopener noreferrer' : null"
    :aria-label="ariaLabel || null"
    :aria-describedby="ariaDescribedby || null"
    :aria-disabled="disabled ? 'true' : null"
    :tabindex="disabled ? -1 : null"
    @click="(event) => handleClick(event)"
    @keydown="handleKeydown"
  >
    <slot />
  </a>

  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-label="ariaLabel || null"
    :aria-describedby="ariaDescribedby || null"
    @click="handleButtonClick"
    @keydown="handleButtonKeydown"
  >
    <slot />
  </button>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'ClickableTextComponent',
  components: { RouterLink },
  props: {
    actionType: {
      type: String,
      default: 'navigation',
      validator: (value) => ['navigation', 'action'].includes(value)
    },
    href: { type: String, default: '#' },
    to: { type: [String, Object], default: null },
    external: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    ariaLabel: { type: String, default: '' },
    ariaDescribedby: { type: String, default: '' }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const isNavigation = computed(() => props.actionType === 'navigation')
    const hasRouterLink = computed(() => Boolean(props.to))

    const classes = computed(() => [
      'clickable-text',
      { 'clickable-text--disabled': props.disabled }
    ])

    const shouldBypassNavigate = (event) =>
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0

    const handleClick = (event, navigate) => {
      if (props.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      emit('click', event)

      if (!isNavigation.value) return

      if (shouldBypassNavigate(event)) return

      if (navigate) {
        event.preventDefault()
        navigate()
      }
    }

    const handleKeydown = (event, navigate) => {
      if (props.disabled) {
        event.preventDefault()
        return
      }
      if (!isNavigation.value) return

      if (event.key === 'Enter' && navigate) {
        event.preventDefault()
        emit('click', event)
        navigate()
      }
    }

    const handleButtonClick = (event) => {
      if (props.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      emit('click', event)
    }

    const handleButtonKeydown = (event) => {
      if (props.disabled) {
        event.preventDefault()
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        emit('click', event)
      }
    }

    return {
      isNavigation,
      hasRouterLink,
      classes,
      handleClick,
      handleKeydown,
      handleButtonClick,
      handleButtonKeydown
    }
  }
})
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  outline: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: var(--color-text-secondary) !important;
  transition: color var(--transition-normal);
}

@media (hover: hover) and (pointer: fine) {
  .clickable-text:hover:not(.clickable-text--disabled) {
    color: var(--color-brand-primary) !important;
  }
}

.clickable-text:active:not(.clickable-text--disabled) {
  color: var(--color-interactive-pressed) !important;
}

.clickable-text:visited {
  color: var(--color-text-secondary) !important;
}

.clickable-text--disabled {
  color: var(--color-text-disabled) !important;
  cursor: not-allowed !important;
  pointer-events: none;
}

a.clickable-text {
  text-decoration: none !important;
}

a.clickable-text:focus,
a.clickable-text:active,
a.clickable-text:visited {
  text-decoration: none !important;
}

@media (hover: hover) and (pointer: fine) {
  a.clickable-text:hover {
    text-decoration: none !important;
  }
}

button.clickable-text {
  border: none;
  background: transparent;
}

@media (max-width: 768px) {
  .clickable-text {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>

