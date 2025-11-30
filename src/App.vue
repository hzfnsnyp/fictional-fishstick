<!-- FILE: src/App.vue -->
<!-- Main application component with header and home sections -->

<template>
  <div id="app">
    <HeaderComponent :brand="brandName" :links="navLinks" />
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
    <footer>
      <FooterComponent
        :brand="brandName"
        :email="contactEmail"
        :instagram-handle="instagramHandle"
        :instagram-url="instagramUrl"
        :phones="footerPhones"
        :links="footerLinks"
      />
    </footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderComponent from './components/layout/HeaderComponent.vue'
import FooterComponent from './components/layout/FooterComponent.vue'
import { useGlobalStatus, useGlobalSettings } from '@/composables/useSanity'

const router = useRouter()
const route = useRoute()

const defaultNavLinks = [
  { label: 'Biography', to: { name: 'about' } },
  { label: 'Projects', to: { name: 'projects' } },
  { label: 'Artworks', to: { name: 'artworks' } },
  { label: 'Exhibitions', to: { name: 'exhibitions' } },
  { label: 'Media', to: { name: 'media' } },
]

const defaultFooterLinks = [
  { label: 'Biography', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Artworks', href: '/artworks' },
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Media', href: '/media' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' }
]

const { status, fetchStatus } = useGlobalStatus()
const { settings, fetchSettings } = useGlobalSettings()

const brandName = computed(() =>
  settings.value?.siteName ||
  status.value?.siteName ||
  import.meta.env.VITE_SITE_NAME ||
  'Artist Name'
)

const contactEmail = computed(() =>
  settings.value?.contactEmail ||
  settings.value?.socialLinks?.email ||
  status.value?.contactEmail ||
  'artist@email.com'
)

const instagramHandle = computed(() =>
  settings.value?.socialLinks?.instagramHandle ||
  settings.value?.socialLinks?.instagram ||
  '@artistname'
)
const instagramUrl = computed(() => settings.value?.socialLinks?.instagramUrl || '')
const footerPhones = computed(() => {
  const phone = settings.value?.socialLinks?.phone
  return phone ? [phone] : []
})

const navLinks = computed(() =>
  Array.isArray(settings.value?.navigationLinks) && settings.value.navigationLinks.length
    ? settings.value.navigationLinks
    : defaultNavLinks
)

const footerLinks = computed(() =>
  Array.isArray(settings.value?.footerLinks) && settings.value.footerLinks.length
    ? settings.value.footerLinks
    : defaultFooterLinks
)

onMounted(async () => {
  await Promise.all([fetchStatus(), fetchSettings()])

  if (status.value?.maintenanceMode && route.name !== 'maintenance') {
    router.push('/maintenance')
  }
})

onBeforeUnmount(() => {
})
</script>

<style scoped>
/* ==========================================================================
  Main App Styles (Component-specific only, baseline handled by BaselineLayout)
   ========================================================================== */
#app {
  min-height: 100vh;
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  font-family: var(--font-body); /* Noto Sans */

  /* УДАЛЕН line-height - теперь обрабатывается BaselineLayout */
}

/* Main content landmark */
#main-content {
  outline: none; /* Remove outline when focused programmatically */
}

#main-content:focus {
  outline: none;
}

/* УДАЛЕНЫ baseline правила для h1-h6 - теперь обрабатывается BaselineLayout */

.main-content {
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}

/* While only Hero is shown, do not add extra bottom padding on the only section */
.hero-only > *:last-child {
  padding-bottom: 0;
}
</style>

<style>
/* ==========================================================================
   Global App Styles (Non-baseline related)
   ========================================================================== */

/* Любые другие глобальные стили, которые НЕ связаны с baseline */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  background: var(--color-background);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles are handled in styles/base/_focus_styles.css */
</style>
