<template>
  <main class="main-content flow main-content--flow-loose">
    <section class="layout-main">
      <h1>Layout/Gutters Test</h1>
      <p class="text-muted">Verifies horizontal alignment to header rails using layout containers.</p>
    </section>

    <section class="layout-main">
      <p class="block-caption">components/about/FeaturedExhibitionSection.vue</p>
      <FeaturedExhibitionSection />
    </section>
    <section class="layout-main">
      <p class="block-caption">components/artworks/ArtworksGrid.vue</p>
      <ArtworksGrid />
    </section>
  </main>
</template>

<script>
import FeaturedExhibitionSection from '@/components/shared/FeaturedExhibitionSection.vue'
import ArtworksGrid from '@/components/artworks/ArtworksGrid.vue'

export default {
  name: 'LayoutGuttersTestView',
  components: { FeaturedExhibitionSection, ArtworksGrid }
}
</script>

<style scoped>
h1 { margin: 0; }
.block-caption {
  margin: 0 0 var(--spacing-16) 0;
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  color: var(--color-text-muted);
}
</style>
