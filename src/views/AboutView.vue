<template>
  <main class="main-content flow about-page">
    <div class="layout-main">
      <h1 class="page-title">{{ biographySection.heading }}</h1>
    </div>

    <AboutBiographySection
      style="--flow-space: var(--spacing-96)"
      :paragraphs="biographySection.paragraphs"
      :image-src="biographySection.imageSrc"
      :image-alt="biographySection.imageAlt"
      :image-caption="biographySection.imageCaption"
      :downloads="biographySection.downloads"
    />

    <FeaturedPressList
      container="content"
      :items="featuredPress"
      style="--flow-space: var(--spacing-96)"
    />

    <div class="layout-content" style="--flow-space: var(--spacing-96)">
      <h2>{{ statementBlock.heading }}</h2>
    </div>

    <ArtistStatementSection
      container="content"
      :paragraphs="statementBlock.paragraphs"
      style="--flow-space: var(--spacing-32)"
    />

  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AboutBiographySection from '@/components/about/AboutBiographySection.vue'
import ArtistStatementSection from '@/components/about/ArtistStatementSection.vue'
import FeaturedPressList from '@/components/shared/FeaturedPressList.vue'
import { usePage } from '@/composables/useSanity'
import { usePageContent } from '@/composables/useCMSData'
import { useSEO } from '@/composables/useSEO'

const { page, fetchPage } = usePage('about')
const { setSEO } = useSEO()

const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill=\"%23910d0f\"/></svg>'

const fallbackBiography = {
  heading: 'Biography',
  eyebrow: '',
  paragraphs: [
    'Leah Sanata works between Dubai and itinerant residencies, building paintings where geometry slows time and light holds emotion. Trained outside of institutions, she treats every series as an inquiry: what does grace look like when it is engineered through color, proportion, and patience?',
    'Her process, which she calls “gradualism,” is a slow accumulation of glazes and decisive impasto strokes. Underlayers map harmonic ratios; upper layers listen for light. The method emerged in 2021 after years of experimentation across watercolor, ink, and oil.',
    'Recent exhibitions in Europe and Central Asia introduced catalogues that document her systems of color, prompting collaborations with architects and designers. Publications include features in Artist Talk Magazine (UK), Goddessarts Magazine (DE), and Visual Art Journal (NL).',
    'Sanata’s practice remains grounded in observation. Sketches of desert light and botanical motifs inform the grids and arcs that recur throughout her canvases. The work argues that beauty—chosen deliberately—is both radical and durable.'
  ],
  imageSrc: placeholderImage,
  imageAlt: 'Studio portrait placeholder',
  imageCaption: '',
  downloads: [
    { label: 'Catalog — Gradualism series', meta: 'PDF', href: '' },
    { label: 'Catalog — Chromatic Gardens series', meta: 'PDF', href: '' },
    { label: 'Selected exhibitions', meta: 'PDF', href: '' },
    { label: 'Curriculum vitae', meta: 'PDF', href: '' },
    { label: 'Selected artworks catalog', meta: 'PDF', href: '' }
  ]
}

const fallbackStatement = {
  heading: 'Artist Statement',
  paragraphs: [
    'Replace with Sanity → Pages → About (Essay section).',
    'Use this block for a concise statement pulled from CMS.'
  ]
}

const contentSections = computed(() => usePageContent(page.value)?.value || [])

const featuredPress = [
  { title: 'Vesti.kg', type: 'Press release', date: 'April 21, 2025', headline: '40 Roses by Leah Sanata: Painting Where Light Becomes the Language of Eternity' }
]

const biographySection = computed(() => {
  const essay = contentSections.value.find(item => item.type === 'essay')

  return {
    heading: page.value?.title || fallbackBiography.heading,
    eyebrow: fallbackBiography.eyebrow,
    paragraphs: essay?.paragraphs?.length ? essay.paragraphs : fallbackBiography.paragraphs,
    imageSrc: fallbackBiography.imageSrc,
    imageAlt: fallbackBiography.imageAlt,
    imageCaption: fallbackBiography.imageCaption,
    downloads: fallbackBiography.downloads
  }
})

const statementBlock = computed(() => {
  const section = contentSections.value.find(item => item.type === 'essay')
  if (!section) return fallbackStatement

  return {
    heading: section.headingLine1 || fallbackStatement.heading,
    paragraphs: section.paragraphs?.length ? section.paragraphs : fallbackStatement.paragraphs
  }
})

onMounted(async () => {
  await fetchPage('about')

  const seo = page.value?.seo
  if (seo) {
    setSEO({
      title: seo.metaTitle || page.value.title || 'About',
      description: seo.metaDescription,
      image: seo.metaImage?.data?.attributes?.url
    })
  } else {
    setSEO({
      title: 'About',
      description: 'About page content will be loaded from Sanity.'
    })
  }
})
</script>

<style scoped>
.about-page {
  padding-bottom: var(--spacing-96);
}

@media (max-width: 768px) {
  .about-page {
    padding-bottom: var(--spacing-64);
  }
}
</style>
