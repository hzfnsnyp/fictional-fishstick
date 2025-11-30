<template>
  <main class="main-content flow main-content--flow-loose">
    <section class="layout-main">
      <BreadcrumbsComponent :items="[
        { label: 'Home', to: '/' },
        { label: 'Styleguide', href: '#' },
        { label: 'UI Library', href: '#' },
        { label: 'UI Demo' }
      ]" />
      <h1 class="page-title">UI Components Demo</h1>
      <p>UI demo components have been removed. This page is reserved for future UI documentation.</p>
    </section>
  </main>

</template>

<script>
import BreadcrumbsComponent from '@/components/ui/BreadcrumbsComponent.vue'

export default {
  name: 'UIDemoView',
  components: { BreadcrumbsComponent }
}
</script>

<style scoped>
.page-title { margin-bottom: var(--spacing-32); }
</style>
