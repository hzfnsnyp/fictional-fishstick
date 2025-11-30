<template>
  <main class="main-content flow series-page">
    <h1 class="sr-only">Projects</h1>
    <section
      v-for="series in seriesSections"
      :key="series.slug || series.heading.line1"
      class="series-section section-pad-compact section-pad-none-mobile"
    >
      <!-- Series Story Section -->
      <div class="layout-content series-story">
        <div class="series-story__intro">
          <h2 class="series-story__title">{{ series.heading.line1 }}</h2>
          <p v-if="series.heading.line2" class="series-story__subtitle">
            {{ series.heading.line2 }}
          </p>
          <p v-if="series.heading.line3" class="series-story__subtitle">
            {{ series.heading.line3 }}
          </p>
        </div>
        <div class="series-story__body">
          <p v-for="(paragraph, index) in series.paragraphs" :key="index">
            {{ paragraph }}
          </p>

          <!-- Metadata Collapsible Section -->
          <CollapsibleSection
            title="Project metadata"
            :default-expanded="false"
            variant="default"
          >
            <table class="series-metadata">
              <tbody>
                <tr>
                  <th>Project</th>
                  <td>{{ series.heading.line1 }}</td>
                </tr>
                <tr>
                  <th>Period</th>
                  <td>{{ series.metadata?.period || series.periodLabel }}</td>
                </tr>
                <tr>
                  <th>Works</th>
                  <td>{{ series.metadata?.works || series.slides.length + ' pieces' }}</td>
                </tr>
                <tr>
                  <th>Medium</th>
                  <td>{{ series.metadata?.medium || series.medium }}</td>
                </tr>
                <tr>
                  <th>Dimensions</th>
                  <td>{{ series.metadata?.dimensions || series.dimensions }}</td>
                </tr>
              </tbody>
            </table>
          </CollapsibleSection>
        </div>
      </div>

      <div class="series-section__gallery layout-wide">
        <ArtworkCarousel :slides="series.slides" />
        <div class="series-section__cta">
          <ButtonComponent
            variant="primary"
            size="medium"
            @click="goToProjects(series.ctaHref)"
          >
            {{ series.ctaLabel }}
          </ButtonComponent>
          <ButtonComponent
            v-if="series.catalogUrl"
            variant="secondary"
            size="medium"
            @click="downloadCatalog(series.catalogUrl)"
          >
            Download catalog (PDF)
          </ButtonComponent>
        </div>
      </div>
    </section>

    <!-- Global Lightbox -->
    <ArtworkLightbox :items="lightboxItems" :hide-preview="true" />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArtworkCarousel from '@/components/shared/ArtworkCarousel.vue'
import ArtworkLightbox from '@/components/artworks/ArtworkLightbox.vue'
import ButtonComponent from '@/components/ui/ButtonComponent.vue'
import CollapsibleSection from '@/components/ui/CollapsibleSection.vue'
import { useLightbox } from '@/composables/useLightbox'
import { useSEO } from '@/composables/useSEO'
import { useSeries } from '@/composables/useSeries'
import { useSeriesData } from '@/composables/useCMSData'

const router = useRouter()
const { lightboxItems } = useLightbox()
const { setSEO } = useSEO()
const { series, fetchSeries } = useSeries()

const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill=\"%23910d0f\"/></svg>'

const fallbackSlides = [
  {
    src: placeholderImage,
    title: 'Project artwork placeholder',
    year: '2024',
    medium: 'Mixed media',
    dimensions: '100 × 80 cm',
    width: 800,
    height: 1200
  }
]

const fallbackSeries = [
  {
    slug: 'project-placeholder',
    heading: { line1: 'Project placeholder', line2: 'Add projects in Sanity', line3: '' },
    paragraphs: ['Projects content will load from Sanity.'],
    periodLabel: '2024–present',
    medium: 'Mixed media',
    dimensions: 'Various',
    metadata: {},
    slides: fallbackSlides,
    ctaHref: { name: 'projects' },
    ctaLabel: 'View full project',
    catalogUrl: ''
  }
]

const seriesSections = computed(() => {
  if (!series.value?.length) return fallbackSeries

  return series.value.map((item) => {
    const data = useSeriesData(item).value
    const periodLabel = data.startYear && data.endYear
      ? `${data.startYear}—${data.endYear}`
      : data.startYear && !data.endYear
        ? `${data.startYear}—present`
        : ''

    const slides = (data.artworks || []).map((art) => ({
      src: art.images?.[0]?.src || art.image || placeholderImage,
      title: art.title,
      year: art.year,
      medium: art.medium,
      dimensions: art.dimensions,
      width: art.images?.[0]?.width || art.width,
      height: art.images?.[0]?.height || art.height
    }))

    return {
      slug: data.slug,
      heading: {
        line1: data.title,
        line2: data.description?.slice(0, 120),
        line3: ''
      },
      paragraphs: data.description ? [data.description] : ['Add description in Sanity.'],
      periodLabel,
      medium: data.metadata?.find(meta => meta.label === 'medium')?.value || data.description,
      dimensions: data.metadata?.find(meta => meta.label === 'dimensions')?.value || '',
      metadata: data.metadata || {},
      slides: slides.length ? slides : fallbackSlides,
      ctaHref: data.slug ? { name: 'projects', params: { slug: data.slug } } : { name: 'projects' },
      ctaLabel: 'View full project',
      catalogUrl: data.catalogPdf?.url || ''
    }
  })
})

const goToProjects = (target) => {
  if (!target) return
  router.push(target)
}

const downloadCatalog = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}

onMounted(async () => {
  await fetchSeries()
  setSEO({
    title: 'Projects',
    description: 'Explore ongoing projects and bodies of work. Each project represents a distinct investigation into color, form, and material practice.',
  })
})
</script>

<style scoped>
.series-page {
  background: var(--color-surface-primary);
}

/* Remove top padding from first section to align with other pages */
.series-section:first-of-type {
  padding-block-start: 0;
}

.series-section {
  display: grid;
  gap: var(--spacing-64);
}

/* Series Story Section - Similar to NarrativeSection */
.series-story {
  padding-block-start: 0;
  padding-block-end: var(--spacing-48);
  display: grid;
  gap: var(--spacing-64);
}

.series-story__intro {
  display: grid;
  gap: var(--spacing-24);
}

.series-story__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-64);
  font-weight: var(--font-weight-light);
  color: var(--color-text-primary);
}

.series-story__subtitle {
  margin: 0;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: var(--font-size-24);
  color: var(--color-text-primary);
  line-height: var(--line-height-loose);
}

.series-story__body {
  max-width: 75ch;
  display: grid;
  gap: var(--spacing-24);
  color: var(--color-text-primary);
  font-size: var(--font-size-18);
  line-height: var(--line-height-loose);
}

.series-story__body p {
  margin: 0;
}

/* Metadata Table */
.series-metadata {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-18);
  line-height: var(--line-height-normal);
}

.series-metadata tr {
  border: none;
}

.series-metadata th,
.series-metadata td {
  padding: var(--spacing-12) 0;
  text-align: left;
  vertical-align: top;
  font-size: var(--font-size-18);
  border: none;
}

.series-metadata th {
  width: 30%;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: none;
  background: transparent;
}

.series-metadata td {
  color: var(--color-text-primary);
}

.series-section__gallery {
  display: grid;
  gap: var(--spacing-24);
}

/* Remove carousel padding - put it on rails like home view */
.series-section__gallery :deep(.artwork-carousel) {
  padding: 0;
}

.series-section__cta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-16);
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .series-page {
    padding-block: var(--spacing-64);
  }

  .series-section {
    gap: var(--spacing-48);
  }

  .series-story {
    gap: var(--spacing-48);
  }
}

@media (max-width: 768px) {
  .series-page {
    padding-block: var(--spacing-32);
    padding-top: calc(var(--header-height) + var(--spacing-16));
  }

  .series-section {
    gap: var(--spacing-24);
  }

  .series-story {
    gap: var(--spacing-32);
    padding-block-end: var(--spacing-32);
  }

  .series-story__title {
    font-size: var(--font-size-48);
  }

  .series-story__subtitle {
    font-size: var(--font-size-20);
  }

  .series-story__body {
    font-size: var(--font-size-16);
    gap: var(--spacing-20);
  }

  .series-metadata {
    font-size: var(--font-size-16);
  }

  .series-metadata th,
  .series-metadata td {
    font-size: var(--font-size-16);
  }

  .series-metadata th {
    width: 35%;
  }

  .series-section__gallery {
    gap: var(--spacing-16);
  }

  .series-section__cta {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .series-section:first-of-type {
    padding-block-start: var(--spacing-24);
  }
}
</style>
