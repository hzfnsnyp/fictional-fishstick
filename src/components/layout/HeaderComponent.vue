<template>
  <div>
    <!-- Header -->
    <header class="header">
      <div class="header__content">
        <div class="header__brand-group">
          <ClickableTextComponent
            href="#main-content"
            class="header__skip-link"
          >
            Skip to main content
          </ClickableTextComponent>

          <ClickableTextComponent
            :to="{ name: 'home' }"
            action-type="navigation"
            class="header__logo"
          >
            {{ isMenuOpen ? 'Navigation' : brand }}
          </ClickableTextComponent>
        </div>

        <ButtonComponent
          ref="menuToggleRef"
          variant="secondary"
          size="small"
          class="header__menu-toggle"
          @click="toggleMenu"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="isMenuOpen"
          aria-controls="site-menu-overlay"
        >
          <IconComponent
            :name="isMenuOpen ? 'cross' : 'menu-hamburger'"
            :size="24"
          />
        </ButtonComponent>
      </div>
    </header>

    <!-- Overlay Menu -->
    <div
      ref="menuOverlayRef"
      id="site-menu-overlay"
      class="menu-overlay"
      :class="{ 'menu-overlay--open': isMenuOpen }"
      @click="handleOverlayClick"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <!-- Backdrop mirrors filter overlay behavior: visibility + blur on self -->
      <div
        class="menu-overlay__backdrop"
        :class="{ 'menu-overlay__backdrop--visible': isMenuOpen }"
        aria-hidden="true"
      ></div>
      <div class="menu-overlay__content" @click.stop>
        <div class="menu-overlay__main">
          <div class="menu-overlay__nav-section">
            <nav class="menu-overlay__nav" aria-label="Main navigation">
              <ul class="menu-nav">
                <li
                  v-for="(link, index) in links"
                  :key="index"
                  class="menu-nav__item"
                >
                  <ClickableTextComponent
                    :ref="index === 0 ? firstFocusableRef : null"
                    :to="link.to"
                    :href="link.href"
                    action-type="navigation"
                    class="menu-nav__link"
                    @click="closeMenu"
                  >
                    {{ link.label }}
                  </ClickableTextComponent>
                </li>
              </ul>
            </nav>
          </div>

          <div class="menu-overlay__divider divider-v"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import ClickableTextComponent from "../ui/ClickableTextComponent.vue";
import IconComponent from "../ui/IconComponent.vue";
import ButtonComponent from "../ui/ButtonComponent.vue";

export default {
  name: "HeaderComponent",
  props: {
    brand: {
      type: String,
      default: "Artist name"
    },
    links: {
      type: Array,
      default: () => ([
        { label: 'Biography', to: { name: 'about' } },
        { label: 'Projects', to: { name: 'projects' } },
        { label: 'Artworks', to: { name: 'artworks' } },
        { label: 'Exhibitions', to: { name: 'exhibitions' } },
        { label: 'Media', to: { name: 'media' } }
      ])
    }
  },
  components: { ClickableTextComponent, IconComponent, ButtonComponent },
  setup() {
    const isMenuOpen = ref(false);
    const menuToggleRef = ref(null);
    const menuOverlayRef = ref(null);
    const firstFocusableRef = ref(null);

    // Desktop breakpoint (reactive)
    const isDesktop = ref(false);
    let mql;

    const updateIsDesktop = () => {
      isDesktop.value = window.innerWidth >= 1024;
    };

    let previouslyFocusedElement = null;
    let focusableElements = [];
    let lockedScrollY = 0;

    const getFocusableElements = () => {
      if (!menuOverlayRef.value) return [];
      const navLinks = Array.from(
        menuOverlayRef.value.querySelectorAll(".menu-nav__link")
      );
      return navLinks.filter(
        (el) => el && el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hidden
      );
    };

    const handleFocusTrap = (e) => {
      if (!isMenuOpen.value || !focusableElements.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

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

    const toggleMenu = async () => {
      if (isMenuOpen.value) {
        closeMenu();
        return;
      }

      isMenuOpen.value = true;
      previouslyFocusedElement = document.activeElement;

      lockScroll();

      await nextTick();
      focusableElements = getFocusableElements();
      if (focusableElements.length > 0 && !isDesktop.value) {
        const firstNavLink =
          firstFocusableRef.value?.$el || focusableElements[0];
        setTimeout(() => firstNavLink.focus(), 10);
      }
    };

    const closeMenu = () => {
      if (!isMenuOpen.value) return;
      isMenuOpen.value = false;

      unlockScroll();

      if (previouslyFocusedElement && !isDesktop.value) {
        previouslyFocusedElement.focus();
        previouslyFocusedElement = null;
      }
      focusableElements = [];
    };

    const handleKeydown = (e) => {
      if (!isMenuOpen.value) return;
      if (e.key === "Escape") closeMenu();
      else if (e.key === "Tab") handleFocusTrap(e);
    };

    const handleOverlayClick = (e) => {
      if (e.target === menuOverlayRef.value) {
        closeMenu();
      }
    };

    const handleClickOutside = (e) => {
      if (!isMenuOpen.value) return;
      const headerElement = document.querySelector(".header");
      const menuElement = menuOverlayRef.value;
      if (headerElement && menuElement) {
        const isClickInsideHeader = headerElement.contains(e.target);
        const isClickInsideMenu = menuElement.contains(e.target);
        if (!isClickInsideHeader && !isClickInsideMenu) {
          closeMenu();
        }
      }
    };

    onMounted(() => {
      updateIsDesktop();
      mql = window.matchMedia("(min-width: 1024px)");
      const mqListener = () => updateIsDesktop();
      mql.addEventListener?.("change", mqListener);
      window.addEventListener("resize", updateIsDesktop);

      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updateIsDesktop);
      try {
        mql &&
          mql.removeEventListener &&
          mql.removeEventListener("change", updateIsDesktop);
      } catch {}

      // safety cleanup
      unlockScroll();
    });

    return {
      isMenuOpen,
      isDesktop,
      menuToggleRef,
      menuOverlayRef,
      firstFocusableRef,
      toggleMenu,
      closeMenu,
      handleOverlayClick,
    };
  },
};
</script>

<style scoped>
/* ==========================================================================
   HEADER CONTAINER
   ==========================================================================
*/
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--color-surface-primary);
  border-bottom: var(--border-width) solid var(--color-border-default);
  z-index: calc(var(--z-overlay) + 1);
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding-inline-start: max(var(--site-gutter-x), env(safe-area-inset-left));
  padding-inline-end: max(var(--site-gutter-x), env(safe-area-inset-right));
}

.header__brand-group {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-12);
  position: relative;
  min-height: var(--header-height);
}

/* ==========================================================================
   HEADER LOGO
   ==========================================================================
*/
.header__logo {
  font-family: var(--font-heading-light);
  font-size: var(--font-size-24);
  line-height: var(--lh-24);
  font-weight: var(--font-weight-light);
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity var(--transition-fast), visibility var(--transition-fast);
}

.header__skip-link {
  position: absolute;
  inset: 0 auto 0 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  line-height: var(--lh-16);
  font-weight: var(--font-weight-medium);
  color: var(--color-surface-primary) !important;
  border: var(--border-width) solid var(--color-brand-primary);
  padding: 0;
  min-height: var(--button-height-small);
  max-height: calc(var(--header-height) - var(--spacing-12));
  background: var(--color-brand-primary);
  text-decoration: none;
  transition: max-width var(--transition-fast), opacity var(--transition-fast), padding var(--transition-fast), margin var(--transition-fast);
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  margin-right: 0;
  box-shadow: none;
  white-space: nowrap;
  top: 50%;
  transform: translateY(-50%);
}

.header__skip-link:visited {
  color: var(--color-surface-primary) !important;
}

.header__skip-link:focus-visible {
  max-width: 320px;
  opacity: 1;
  margin-right: var(--spacing-16);
  box-shadow: var(--shadow-focus-ring);
  padding: var(--button-padding-small-v) var(--button-padding-small-h);
}

.header__skip-link:hover {
  color: var(--color-surface-primary) !important;
  background: var(--color-brand-primary);
}

.header__skip-link:active {
  background: var(--color-brand-hover);
  color: var(--color-surface-primary) !important;
}

@media (hover: hover) and (pointer: fine) {
  .header__skip-link:hover {
    background: var(--color-brand-hover);
    color: var(--color-surface-primary) !important;
  }
}

/* ==========================================================================
   MENU TOGGLE BUTTON
   ==========================================================================
*/
.header__menu-toggle.btn {
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

.header__menu-toggle.btn svg {
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

@media (hover: hover) and (pointer: fine) {
  .header__menu-toggle.btn:hover svg {
    color: var(--color-brand-primary);
  }
}

.header__menu-toggle.btn:active svg {
  color: var(--color-interactive-pressed);
}

/* ==========================================================================
   MENU OVERLAY CONTAINER
   ==========================================================================
*/
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: transparent; /* allow backdrop to blur the page */
  z-index: var(--z-overlay);
  opacity: 1;
  visibility: hidden;
  pointer-events: none;
  transition: visibility var(--transition-fast);
}

/* Desktop: dropdown overlay */
@media (min-width: 1024px) {
  /* Fullscreen overlay container so backdrop can blur the area below the panel */
  .menu-overlay {
    height: 100vh;
    top: 0;
  }
}

/* Mobile/tablet: full screen overlay */
@media (max-width: 1023px) {
  .menu-overlay {
    height: 100vh;
  }
}

.menu-overlay--open {
  visibility: visible;
  pointer-events: auto;
}

.menu-overlay__content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1; /* keep above the backdrop */
  background-color: var(--color-surface-primary);
  transform: translateY(-16px);
  opacity: 0;
  transition: opacity var(--transition-normal),
    transform var(--transition-normal);
}
.menu-overlay--open .menu-overlay__content {
  transform: translateY(0);
  opacity: 1;
}

/* Desktop: the panel occupies fixed height below the header */
@media (min-width: 1024px) {
  .menu-overlay__content {
    height: 55vh;
    margin-top: var(--header-height);
    border-bottom: var(--border-width) solid var(--color-border-subtle);
  }
}

/* Mobile/tablet: full screen content area under header */
@media (max-width: 1023px) {
  .menu-overlay__content {
    height: calc(100vh - var(--header-height));
    margin-top: var(--header-height);
  }
}
/* Backdrop matches site background */
.menu-overlay__backdrop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  visibility: hidden;
  background: var(--color-surface-primary);
  transition: visibility var(--transition-fast), opacity var(--transition-fast);
  opacity: 0;
}
.menu-overlay__backdrop--visible {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

.menu-overlay__main {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.menu-overlay__nav-section {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: var(--spacing-64);
}
.menu-overlay__nav {
  text-align: right;
}
.menu-overlay__divider {
  height: 100vh;
  margin-right: var(--spacing-48);
}
/* Prevent double-line effect from subpixel transform */
.menu-overlay__divider.divider-v {
  transform: none;
}
@media (min-width: 1024px) {
  .menu-overlay__divider {
    display: none;
  }
}

/* Nav typography */
.menu-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-nav__item {
  margin-bottom: var(--spacing-12);
  font-family: var(--font-heading-light);
  font-size: var(--font-size-76);
  line-height: var(--lh-76);
  font-weight: var(--font-weight-light);
  text-transform: uppercase;
}
@media (min-width: 1024px) {
  .menu-nav__item {
    font-size: var(--font-size-46);
    line-height: var(--lh-46);
    margin-bottom: var(--spacing-20);
  }
}
.menu-nav__item:last-child {
  margin-bottom: 0;
}
.menu-nav__link {
  display: block;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .header__logo {
    font-size: var(--font-size-24); /* 24px on mobile */
    line-height: var(--lh-24); /* 36px line-height */
  }
  .header__menu-toggle.btn {
    width: var(--button-height-small) !important;
    height: var(--button-height-small) !important;
  }
  .menu-overlay__main {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: var(--header-height);
  }
  .menu-overlay__nav-section {
    margin: 0;
    flex-direction: column;
    align-items: center;
  }
  .menu-overlay__nav {
    text-align: center;
    order: 2;
  }
  .menu-overlay__divider {
    order: 1;
    width: 200px;
    height: 1px;
    margin: 0 0 var(--spacing-48) 0;
    display: none;
  }
  .menu-nav__item {
    font-size: var(--font-size-46);
    line-height: var(--lh-46);
    margin-bottom: var(--spacing-12);
  }
}
/* Tablet: use mobile layout but with larger type */
@media (min-width: 641px) and (max-width: 1023px) {
  .menu-overlay__main {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: var(--header-height);
  }
  .menu-overlay__nav-section {
    margin: 0;
    flex-direction: column;
    align-items: center;
  }
  .menu-overlay__nav {
    text-align: center;
    order: 2;
  }
  .menu-overlay__divider {
    display: none;
  }
  .menu-nav__item {
    font-size: var(--font-size-60);
    line-height: var(--lh-60);
    margin-bottom: var(--spacing-12);
  }
}
@media (max-width: 480px) {
  .menu-nav__item {
    font-size: var(--font-size-38);
    line-height: var(--lh-38);
  }
}
</style>
