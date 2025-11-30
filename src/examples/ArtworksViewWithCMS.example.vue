<!-- 
  Example: ArtworksView with Strapi CMS
  Replace src/views/ArtworksView.vue with this after CMS is deployed
-->

<template>
  <main class="main-content flow main-content--flow-none">
    <h1 class="sr-only">Artworks Gallery</h1>

    <section class="layout-main layout-main--filters">
      <ArtworkFilterPanel
        @filters-changed="handleFiltersChanged"
        @sort-changed="handleSortChanged"
      />
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="layout-main layout-main--grid">
      <div class="loading-state">
        <p>Loading artworks...</p>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="layout-main layout-main--grid">
      <div class="error-state">
        <p>Failed to load artworks. Please try again later.</p>
      </div>
    </section>

    <!-- Artworks Grid -->
    <section v-else class="layout-main layout-main--grid">
      <ArtworksGrid 
        :artworks="formattedArtworks" 
        @artwork-click="onArtworkClick" 
      />
    </section>

    <!-- Global Lightbox -->
    <ArtworkLightbox :items="lightboxItems" :hide-preview="true" />
  </main>
</template>

<script>
import { onMounted, computed } from 'vue'
import ArtworkFilterPanel from '@/components/artworks/ArtworkFilterPanel.vue'
import ArtworksGrid from '@/components/artworks/ArtworksGrid.vue'
import ArtworkLightbox from '@/components/artworks/ArtworkLightbox.vue'
import { useLightbox } from '@/composables/useLightbox'
import { useSEO } from '@/composables/useSEO'
import { useArtworks } from '@/composables/useStrapi'
import { useArtworkData } from '@/composables/useCMSData'

export default {
  name: 'ArtworksView',
  components: { ArtworkFilterPanel, ArtworksGrid, ArtworkLightbox },
  setup() {
    const { lightboxItems, openLightbox } = useLightbox()
    const { setSEO } = useSEO()
    const { artworks, loading, error, fetchArtworks } = useArtworks()

    // Transform CMS data to component format
    const formattedArtworks = computed(() => {
      return artworks.value.map(artwork => {
        const data = useArtworkData(artwork).value
        return {
          id: data.id,
          title: data.title,
          image: data.image,
          alt: data.title,
          year: data.year,
          medium: data.medium,
          dimensions: data.dimensions,
          width: data.width,
          height: data.height,
          src: data.images[0]?.src || data.image
        }
      })
    })

    onMounted(async () => {
      setSEO({
        title: 'Artworks',
        description: 'Browse the complete collection of artworks.',
      })
      await fetchArtworks()
    })

    return { 
      artworks,
      formattedArtworks,
      loading, 
      error,
      lightboxItems, 
      openLightbox 
    }
  },
  methods: {
    handleFiltersChanged(payload) {
      console.debug('[Artworks] filters changed:', payload)
    },
    handleSortChanged(payload) {
      console.debug('[Artworks] sort changed:', payload)
    },
    onArtworkClick(artwork) {
      this.openLightbox([artwork], 0)
    }
  }
}
</script>
