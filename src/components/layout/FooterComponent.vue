<template>
  <footer class="footer" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="visually-hidden">Site footer</h2>

    <!-- Hero Contact Section -->
    <div class="layout-main footer__hero">
      <h2 class="footer__hero-title">For Inquiries</h2>
      
      <div class="footer__contact-grid">
        <div 
          v-if="primaryPhone" 
          class="footer__contact-block"
        >
          <div class="footer__label">Phone</div>
          <div class="footer__content">
            <ClickableTextComponent
              class="footer__link"
              action-type="navigation"
              :href="`tel:${primaryPhone.tel}`"
            >
              {{ primaryPhone.display }}
            </ClickableTextComponent>
          </div>
        </div>

        <div 
          v-if="primaryEmail" 
          class="footer__contact-block"
        >
          <div class="footer__label">Email</div>
          <div class="footer__content">
            <ClickableTextComponent
              class="footer__link"
              action-type="navigation"
              :href="`mailto:${primaryEmail}`"
            >
              {{ primaryEmail }}
            </ClickableTextComponent>
          </div>
        </div>

        <div 
          v-if="instagramHref && instagramLabel" 
          class="footer__contact-block"
        >
          <div class="footer__label">Social Media</div>
          <div class="footer__content">
            <ClickableTextComponent
              class="footer__link"
              action-type="navigation"
              :href="instagramHref"
              :external="true"
            >
              {{ instagramLabel }}
            </ClickableTextComponent>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div v-if="links.length" class="layout-main footer__nav" aria-label="Footer navigation">
      <ul class="footer__nav-list" role="list">
        <li v-for="(link, index) in links" :key="index">
          <ClickableTextComponent
            class="footer__nav-link"
            action-type="navigation"
            :to="isInternal(link.href) ? link.href : undefined"
            :href="isExternal(link.href) ? link.href : undefined"
            :external="isExternal(link.href)"
          >
            {{ link.label }}
          </ClickableTextComponent>
        </li>
      </ul>
    </div>

    <!-- Footer Bottom -->
    <div class="layout-main footer__bottom">
      <small class="footer__copyright">
        © {{ year }} {{ brand }}. All rights reserved.
      </small>
    </div>
  </footer>
</template>

<script>
import { defineComponent, computed } from "vue";
import ClickableTextComponent from "@/components/ui/ClickableTextComponent.vue";

export default defineComponent({
  name: "FooterComponent",
  components: { ClickableTextComponent },
  props: {
    brand: { 
      type: String, 
      default: "Artist Name" 
    },
    email: { 
      type: String, 
      default: "artist@email.com" 
    },
    instagramHandle: { 
      type: String, 
      default: "@artistname" 
    },
    instagramUrl: {
      type: String,
      default: "",
    },
    links: {
      type: Array,
      default: () => [
        { label: 'Biography', href: '/about' },
        { label: 'Projects', href: '/projects' },
        { label: 'Artworks', href: '/artworks' },
        { label: 'Exhibitions', href: '/exhibitions' },
        { label: 'Media', href: '/media' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Use', href: '/terms-of-use' }
      ]
    },
    emails: {
      type: Array,
      default: () => ["artist@email.com"],
    },
    phones: {
      type: Array,
      default: () => ["+1 (555) 123-4567"],
    },
  },
  setup(props) {
    const year = new Date().getFullYear();

    const normalizedEmails = computed(() => {
      const explicit = Array.isArray(props.emails) ? props.emails : [];
      const fallback = props.email ? [props.email] : [];
      return [...explicit, ...fallback].filter(Boolean);
    });

    const normalizedPhones = computed(() => {
      const list = Array.isArray(props.phones) ? props.phones : [];
      return list
        .filter(Boolean)
        .map((raw) => ({
          raw,
          tel: raw.toString().replace(/[^\d+]/g, ""),
          display: raw,
        }));
    });

    const primaryEmail = computed(() =>
      props.email || normalizedEmails.value[0] || null
    );
    const primaryPhone = computed(() => normalizedPhones.value[0] || null);
    const instagramHref = computed(() => {
      if (props.instagramUrl) return props.instagramUrl
      if (props.instagramHandle) {
        const handle = props.instagramHandle.startsWith("@")
          ? props.instagramHandle.slice(1)
          : props.instagramHandle
        return `https://www.instagram.com/${handle}`
      }
      return null
    })
    const instagramLabel = computed(() => {
      if (props.instagramHandle) {
        return props.instagramHandle.startsWith("@")
          ? props.instagramHandle
          : `@${props.instagramHandle}`
      }
      if (props.instagramUrl) return 'Instagram'
      return null
    })

    const isInternal = (href) =>
      typeof href === "string" && href.startsWith("/");
    const isExternal = (href) =>
      typeof href === "string" && /^(https?:)?\/\//.test(href);

    return {
      year,
      normalizedEmails,
      normalizedPhones,
      isInternal,
      isExternal,
      primaryEmail,
      primaryPhone,
      instagramHref,
      instagramLabel,
    };
  },
});
</script>

<style scoped>
/* ==========================================================================
   Utility Classes
   ========================================================================== */
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  clip-path: inset(50%);
}

/* ==========================================================================
   Footer Container
   ========================================================================== */
.footer {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border-top: var(--border-width) solid var(--color-border-default);
}

/* ==========================================================================
   Hero Contact Section
   ========================================================================== */
.footer__hero {
  padding-block: var(--spacing-64);
  border-bottom: var(--border-width) solid var(--color-border-default);
}

.footer__hero-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-48);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-64);
  color: var(--color-text-primary);
}

.footer__contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-64);
}

.footer__contact-block {
  padding-block: var(--spacing-20);
}

.footer__label {
  font-family: var(--font-body);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-12);
}

.footer__content {
  font-family: var(--font-body);
  font-size: var(--font-size-22);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-loose);
  color: var(--color-text-primary);
}

.footer__link {
  color: var(--color-text-primary) !important;
  text-decoration: none !important;
  transition: color var(--transition-fast);
  display: inline;
}

@media (hover: hover) and (pointer: fine) {
  .footer__link:hover {
    color: var(--color-brand-primary) !important;
  }
}

/* ==========================================================================
   Navigation
   ========================================================================== */
  .footer__nav {
    display: flex;
    padding-block: var(--spacing-16);
  }

.footer__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--spacing-32);
}

.footer__nav-link {
  color: var(--color-text-primary) !important;
  text-decoration: none !important;
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-light);
  display: inline-flex;
  align-items: center;
  transition: color var(--transition-fast);
}

@media (hover: hover) and (pointer: fine) {
  .footer__nav-link:hover {
    color: var(--color-text-muted) !important;
  }
}

/* ==========================================================================
   Footer Bottom
   ========================================================================== */
.footer__bottom {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-block: 0 var(--spacing-16);
}

.footer__copyright {
  font-family: var(--font-body);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
}

/* ==========================================================================
   Responsive Design
   ========================================================================== */
@media (max-width: 1024px) {
  .footer__hero {
    padding-block: var(--spacing-48);
  }

  .footer__hero-title {
    font-size: var(--font-size-38);
    margin-bottom: var(--spacing-48);
  }

  .footer__contact-grid {
    gap: var(--spacing-40);
  }

  .footer__nav-list {
    flex-wrap: wrap;
    gap: var(--spacing-24);
  }

  .footer__content {
    font-size: var(--font-size-20);
  }

  .footer__copyright {
    font-size: var(--font-size-20);
  }
}

@media (max-width: 640px) {
  .footer__hero {
    padding-block: var(--spacing-40);
  }

  .footer__hero-title {
    font-size: var(--font-size-32);
    margin-bottom: var(--spacing-32);
  }

  .footer__contact-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-32);
  }

  .footer__contact-block {
    padding-block: var(--spacing-16);
  }

  .footer__label {
    font-size: var(--font-size-16);
    margin-bottom: var(--spacing-8);
  }

  .footer__content {
    font-size: var(--font-size-20);
  }

  .footer__nav-list {
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 0;
  }

  .footer__nav-list li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Visual Grouping: Bio/Projects/Artworks, Exhibitions/Media, Privacy/Terms */
  /* Group 2: Exhibitions, Media (li 4, 5) - add space before Exhibitions */
  .footer__nav-list li:nth-child(4) {
    margin-top: var(--spacing-28);
  }

  /* Group 3: Privacy Policy, Terms of Use (li 6, 7) - add space before Privacy */
  .footer__nav-list li:nth-child(6) {
    margin-top: var(--spacing-28);
  }

  .footer__nav-link {
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: 1.4;
    padding: 0 !important;
    margin: 0 !important;
    min-height: var(--spacing-40) !important;
    min-width: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    text-align: left !important;
    width: 100%;
    color: var(--color-text-primary) !important;
  }

  .footer__nav-link:visited {
    color: var(--color-text-primary) !important;
  }

  .footer__copyright {
    font-size: var(--font-size-16);
  }
}

/* ==========================================================================
   Accessibility Enhancements
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  .footer__link,
  .footer__nav-link {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .footer {
    border-top-color: ButtonText;
  }

  .footer__hero {
    border-bottom-color: ButtonText;
  }
}
</style>
