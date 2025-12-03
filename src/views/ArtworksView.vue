<template>
  <main class="main-content flow">
    <div class="layout-main">
      <h1 class="page-title">Artworks</h1>
    </div>

    <section class="layout-main layout-main--filters" style="--flow-space: var(--spacing-48)">
      <ArtworkFilterPanel
        :year-options="yearOptions"
        :series-options="seriesOptions"
        :medium-options="mediumOptions"
        :size-options="sizeOptions"
        :results-count="formattedArtworks.length"
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
        <p>Failed to load artworks. Showing placeholders.</p>
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

<script setup>
import { onMounted, computed, ref } from 'vue'
import ArtworkFilterPanel from '@/components/artworks/ArtworkFilterPanel.vue'
import ArtworksGrid from '@/components/artworks/ArtworksGrid.vue'
import ArtworkLightbox from '@/components/artworks/ArtworkLightbox.vue'
import { useLightbox } from '@/composables/useLightbox'
import { useSEO } from '@/composables/useSEO'
import { useArtworks } from '@/composables/useArtworks'
import { useArtworkData } from '@/composables/useCMSData'

const { lightboxItems, openLightbox } = useLightbox()
const { setSEO } = useSEO()
const { artworks, loading, error, fetchArtworks } = useArtworks()
const filters = ref({
  years: [],
  series: [],
  sizes: [],
  availability: false,
  mediums: [],
})
const sortBy = ref('year-desc')

const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill=\"%23910d0f\"/></svg>'

const fallbackArtworks = [
  {
    id: 0,
    title: 'Artwork placeholder',
    image: placeholderImage,
    alt: 'Placeholder artwork',
    year: '2024',
    medium: 'Mixed media',
    dimensions: '100 × 80 cm',
    width: 800,
    height: 1200,
    src: placeholderImage
  }
]

const baseArtworks = computed(() => {
  if (!artworks.value?.length) return []
  return artworks.value.map(artwork => {
    const data = useArtworkData(artwork).value
    const main = data.images[0] || {}
    return {
      id: data.id,
      title: data.title,
      image: data.image || main.src || placeholderImage,
      alt: data.title,
      year: data.year,
      medium: data.medium,
      dimensions: data.dimensions,
      width: data.imageWidth || main.width || data.width,
      height: data.imageHeight || main.height || data.height,
      series: data.series,
      available: data.available,
      src: data.image || main.src || placeholderImage,
    }
  })
})

const applySizeBucket = art => {
  const maxDim = Math.max(Number(art.width) || 0, Number(art.height) || 0)
  if (!maxDim) return null
  if (maxDim < 60) return 'small'
  if (maxDim <= 120) return 'medium'
  return 'large'
}

const filteredArtworks = computed(() => {
  let list = baseArtworks.value
  if (!list.length) return []

  if (filters.value.availability) {
    list = list.filter(a => a.available)
  }
  if (filters.value.years.length) {
    list = list.filter(a => filters.value.years.includes(String(a.year)))
  }
  if (filters.value.series.length) {
    list = list.filter(a => {
      if (!a.series) return false
      return filters.value.series.includes(a.series.slug)
    })
  }
  if (filters.value.mediums.length) {
    list = list.filter(a => filters.value.mediums.includes(a.medium))
  }
  if (filters.value.sizes.length) {
    list = list.filter(a => {
      const bucket = applySizeBucket(a)
      return bucket ? filters.value.sizes.includes(bucket) : true
    })
  }

  switch (sortBy.value) {
    case 'year-asc':
      list = [...list].sort((a, b) => (a.year || 0) - (b.year || 0))
      break
    case 'size-desc':
      list = [...list].sort((a, b) => (Math.max(a.width || 0, a.height || 0) < Math.max(b.width || 0, b.height || 0) ? 1 : -1))
      break
    case 'size-asc':
      list = [...list].sort((a, b) => (Math.max(a.width || 0, a.height || 0) > Math.max(b.width || 0, b.height || 0) ? 1 : -1))
      break
    case 'alphabetical':
      list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'year-desc':
    default:
      list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0))
  }

  return list
})

const formattedArtworks = computed(() => {
  if (filteredArtworks.value.length) {
    return filteredArtworks.value
  }
  return fallbackArtworks
})

const yearOptions = computed(() => {
  const years = new Set(baseArtworks.value.map(a => String(a.year)).filter(Boolean))
  return Array.from(years).sort((a, b) => Number(b) - Number(a)).map(y => ({ value: y, label: y }))
})

const seriesOptions = computed(() => {
  const map = new Map()
  baseArtworks.value.forEach(a => {
    if (a.series?.slug) map.set(a.series.slug, a.series.title || a.series.slug)
  })
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
})

const mediumOptions = computed(() => {
  const set = new Set(baseArtworks.value.map(a => a.medium).filter(Boolean))
  return Array.from(set).map(m => ({ value: m, label: m }))
})

const sizeOptions = [
  { value: 'small', label: 'Small (under 60 cm)' },
  { value: 'medium', label: 'Medium (60–120 cm)' },
  { value: 'large', label: 'Large (120+ cm)' },
]

onMounted(async () => {
  setSEO({
    title: 'Artworks',
    description: 'Browse the complete collection of artworks.'
  })
  await fetchArtworks()
})

const handleFiltersChanged = (payload) => {
  filters.value = { ...filters.value, ...payload.filters }
}
const handleSortChanged = (payload) => {
  sortBy.value = payload.sortBy
}
const onArtworkClick = (artwork) => {
  openLightbox([artwork], 0)
}
</script>

<style scoped>
.layout-main--filters {
  margin-bottom: 0;
}

.layout-main--grid {
  margin-top: 0 !important;
}

@media (max-width: 768px) {
  .layout-main--filters {
    margin-bottom: 0;
  }

  .layout-main--grid {
    margin-top: 0 !important;
  }
}
</style>
