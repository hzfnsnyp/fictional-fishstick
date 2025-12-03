<template>
  <main class="main-content flow main-content--flow-none home-page">
    <h1 class="sr-only">Artist Portfolio Home</h1>

    <HeroSection
      v-if="heroBlock"
      :title="heroBlock.title"
      :image-src="heroBlock.imageSrc"
      :image-alt="heroBlock.imageAlt"
      :artwork-title="heroBlock.artworkTitle"
      :year="heroBlock.year"
      :medium="heroBlock.medium"
      :dimensions="heroBlock.dimensions"
      style="--flow-space: 0"
    />

    <div class="layout-content" style="--flow-space: var(--spacing-96)">
      <h2 class="section-title">{{ practicePhasesBlock.heading }}</h2>
    </div>

    <NarrativeSection
      :subheading="practicePhasesBlock.subheading"
      :quote="practicePhasesBlock.quote"
      :quote-author="practicePhasesBlock.quoteAuthor"
      :body="practicePhasesBlock.body"
      :phases="practicePhasesBlock.timeline"
      style="--flow-space: var(--spacing-32)"
    >
      <template #cta>
        <ButtonComponent variant="secondary" size="large" @click="goToAbout">
          Full Biography
        </ButtonComponent>
      </template>
    </NarrativeSection>

    <section class="layout-content home-downloads" style="--flow-space: var(--spacing-96)">
      <h3 class="home-downloads__title">Downloads</h3>
      <ul class="home-downloads__list">
        <li v-for="(item, index) in downloads" :key="index">
          <ButtonComponent
            variant="itinerary"
            size="medium"
            tag="a"
            :href="item.href || '#'"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.label }} <span v-if="item.meta">({{ item.meta }})</span>
          </ButtonComponent>
        </li>
      </ul>
    </section>

    <PracticeHighlightsSection
      style="--flow-space: var(--spacing-96)"
      :image-src="practiceBlock.imageSrc"
      :image-alt="practiceBlock.imageAlt"
      :stats="practiceBlock.stats"
    />

    <SeriesOverviewSection
      :items="seriesItems"
      style="--flow-space: var(--spacing-96)"
    />

    <TechniquesOverviewSection
      container="wide"
      :statement="techniquesBlock.statement"
      :features="techniquesBlock.features"
      style="--flow-space: var(--spacing-96)"
    />

    <section class="home-artworks" style="--flow-space: 0">
      <div class="layout-wide home-artworks__inner">
        <ArtworkCarousel :slides="artworkSlides" />
        <div class="home-artworks__cta">
          <ButtonComponent
            variant="primary"
            size="medium"
            @click="goToArtworks"
          >
            View all artworks
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
import HeroSection from '@/components/home/HeroSection.vue'
import PracticeHighlightsSection from '@/components/home/PracticeHighlightsSection.vue'
import SeriesOverviewSection from '@/components/shared/SeriesOverviewSection.vue'
import NarrativeSection from '@/components/about/NarrativeSection.vue'
import TechniquesOverviewSection from '@/components/shared/TechniquesOverviewSection.vue'
import ArtworkCarousel from '@/components/shared/ArtworkCarousel.vue'
import ArtworkLightbox from '@/components/artworks/ArtworkLightbox.vue'
import ButtonComponent from '@/components/ui/ButtonComponent.vue'
import { useLightbox } from '@/composables/useLightbox'
import { usePage } from '@/composables/useSanity'
import { usePageContent } from '@/composables/useCMSData'
import { useSEO } from '@/composables/useSEO'
import { useRouter } from 'vue-router'

const { lightboxItems } = useLightbox()
const { page, loading, error, fetchPage } = usePage('home')
const router = useRouter()
const { setSEO } = useSEO()

const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="%23910d0f"/></svg>'

const fallbackSections = {
  hero: {
    title: 'I choose beauty as a discipline—painting that speaks quietly and endures.',
    imageSrc: placeholderImage,
    imageAlt: 'Placeholder hero artwork',
    artworkTitle: 'Featured artwork title',
    year: '2024',
    medium: 'Mixed media on canvas',
    dimensions: '120 × 120 cm'
  },
  practicePhases: {
    heading: 'About the artist',
    subheading: '',
    quote: 'The most revolutionary act is simply being authentic to yourself.',
    quoteAuthor: 'Leah Sanata',
    body: [
      'Leah Sanata belongs to a generation of artists who see geography not as a boundary, but as creative fuel. Working from Dubai — a city at the intersection of cultures — she turns mathematical clarity into saturated emotion.',
      'Rejecting formal art school, she built her own methodology through experimentation. By 2021 this became “gradualism” — a meditative, stepwise layering process.',
      'Solo shows across Central Asia and Europe, plus features in Artist Talk Magazine (UK) and Visual Art Journal (NL), mark the current chapter.',
      'Each series is treated as a laboratory where structure and intuition negotiate the final surface.'
    ],
    timeline: [
      { title: 'Formation', period: '2019–2021', description: 'Independent research, color studies, early gradients.' },
      { title: 'Gradualism', period: '2022–present', description: 'Layered chroma systems, exhibitions abroad, catalogues released.' }
    ]
  },
  practice: {
    imageSrc: placeholderImage,
    imageAlt: 'Placeholder practice highlight',
    stats: [
      { value: 'System', description: 'Geometric principles meet intuition', title: 'Method' },
      { value: 'Light', description: 'Architecture of illumination', title: 'Innovation' },
      { value: 'Beauty', description: 'Radical aesthetic choice', title: 'Vision' }
    ]
  },
  techniques: {
    statement: 'Technique is the architecture that holds light and feeling together.',
    features: [
      { title: 'Color Matrix', text: 'Layered chroma scaffolds as a foundation.' },
      { title: 'Glazes', text: 'Transparent layers build depth and luminosity.' },
      { title: 'Impasto', text: 'Decisive relief strokes resolve the surface.' }
    ]
  },
  series: [
    {
      title: 'Project placeholder',
      description: 'Populate with Sanity projects. This shows until CMS data is connected.',
      startYear: 2024,
      endYear: null,
      medium: 'Mixed media',
      dimensions: '',
      image: placeholderImage,
      alt: 'Placeholder project image',
      buttonLabel: 'View project',
      to: { name: 'projects' }
    }
  ],
  artworks: [
    {
      src: placeholderImage,
      title: 'Artwork placeholder',
      year: '2024',
      medium: 'Oil on canvas',
      dimensions: '100 × 80 cm',
      width: 800,
      height: 1200
    }
  ]
}

const contentSections = computed(() => usePageContent(page.value)?.value || [])

const heroBlock = computed(() => {
  const hero = contentSections.value.find(section => section.type === 'hero-composer')
  return hero || fallbackSections.hero
})

const practiceBlock = computed(() => {
  const practice = contentSections.value.find(section => section.type === 'practice-highlights')
  return practice || fallbackSections.practice
})

const practicePhasesBlock = computed(() => {
  const section = contentSections.value.find(item => item.type === 'practice-phases')
  if (!section) return fallbackSections.practicePhases

  return {
    heading: section.heading || fallbackSections.practicePhases.heading,
    subheading: section.subheading || '',
    quote: section.quote || fallbackSections.practicePhases.quote,
    quoteAuthor: section.quoteAuthor || fallbackSections.practicePhases.quoteAuthor,
    body: section.body?.length ? section.body : fallbackSections.practicePhases.body,
    timeline: section.timeline?.length ? section.timeline : fallbackSections.practicePhases.timeline
  }
})

const seriesItems = computed(() => {
  const seriesSection = contentSections.value.find(section => section.type === 'series-overview')
  if (!seriesSection?.series?.length) {
    return fallbackSections.series
  }

  return seriesSection.series.map(item => ({
    title: item.title,
    description: item.description,
    startYear: item.startYear,
    endYear: item.endYear,
    medium: item.metadata?.find(meta => meta.label === 'medium')?.value || item.medium,
    dimensions: item.metadata?.find(meta => meta.label === 'dimensions')?.value || item.dimensions,
    image: item.coverImage || placeholderImage,
    alt: item.title,
    buttonLabel: 'View project',
    to: item.slug ? { name: 'projects', params: { slug: item.slug } } : { name: 'projects' }
  }))
})

const techniquesBlock = computed(() => {
  const block = contentSections.value.find(section => section.type === 'techniques-overview')
  return block || fallbackSections.techniques
})

const artworkSlides = computed(() => {
  const carousel = contentSections.value.find(section => section.type === 'artwork-carousel')
  const artworks = carousel?.artworks || []

  if (!artworks.length) {
    return fallbackSections.artworks
  }

  return artworks.map(art => ({
    src: art.images?.[0]?.src || art.image || placeholderImage,
    title: art.title,
    year: art.year,
    medium: art.medium,
    dimensions: art.dimensions,
    width: art.images?.[0]?.width || art.width,
    height: art.images?.[0]?.height || art.height
  }))
})

const downloads = [
  { label: 'Catalog — Gradualism series', meta: 'PDF', href: '' },
  { label: 'Catalog — Chromatic Gardens series', meta: 'PDF', href: '' },
  { label: 'Selected exhibitions', meta: 'PDF', href: '' },
  { label: 'Curriculum vitae', meta: 'PDF', href: '' },
  { label: 'Selected artworks catalog', meta: 'PDF', href: '' }
]

const goToArtworks = () => {
  router.push({ name: 'artworks' })
}

const goToAbout = () => {
  router.push({ name: 'about' })
}

onMounted(async () => {
  await fetchPage('home')

  const seo = page.value?.seo
  if (seo) {
    setSEO({
      title: seo.metaTitle || page.value.title || 'Home',
      description: seo.metaDescription,
      image: seo.metaImage?.data?.attributes?.url
    })
  } else {
    setSEO({
      title: 'Home',
      description: 'Homepage content is loading from Strapi.'
    })
  }
})
</script>

<style scoped>
.section-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-64);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.home-artworks {
  background: var(--color-surface-primary);
  padding-block: var(--spacing-64);
  display: grid;
  gap: var(--spacing-32);
}

.home-artworks__inner {
  display: grid;
  gap: var(--spacing-24);
}

.home-artworks :deep(.artwork-carousel) {
  padding: 0;
}

.home-artworks__cta {
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .home-artworks {
    padding-block: var(--spacing-48);
    gap: var(--spacing-24);
  }
}

.home-downloads {
  display: grid;
  gap: var(--spacing-24);
}

.home-downloads__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.home-downloads__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  align-items: flex-start;
}

.home-downloads__list li {
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--font-size-48);
  }

  .home-artworks {
    padding-block: var(--spacing-40);
  }

  .home-downloads__title {
    font-size: var(--font-size-20);
  }
}
</style>
