<template>
  <main class="main-content flow media-page">
    <div class="layout-content">
      <h1 class="page-title">Media</h1>
    </div>

    <section class="layout-content media-header" style="--flow-space: var(--spacing-32)">
      <p class="media-lede">
        Catalogs, publications, press, and broadcasts documenting the practice.
      </p>
    </section>

    <FeaturedMagazinesList container="content" :items="featuredMagazines" style="--flow-space: var(--spacing-64)" />
    <FeaturedPressList container="content" :items="featuredPress" style="--flow-space: var(--spacing-64)" />
    <FeaturedRadioList container="content" :items="featuredRadio" style="--flow-space: var(--spacing-64)" />

    <div class="layout-content" style="--flow-space: var(--spacing-96)">
      <h2 class="section-title">Magazines</h2>
    </div>
    <MagazinesArchive :items="magazinesArchive" style="--flow-space: var(--spacing-32)" />

    <div class="layout-content" style="--flow-space: var(--spacing-96)">
      <h2 class="section-title">Press</h2>
    </div>
    <PressArchive :items="pressArchive" style="--flow-space: var(--spacing-32)" />

    <div class="layout-content" style="--flow-space: var(--spacing-96)">
      <h2 class="section-title">Radio</h2>
    </div>
    <RadioArchive :items="radioArchive" style="--flow-space: var(--spacing-32)" />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import MagazinesArchive from '@/components/archive/MagazinesArchive.vue'
import PressArchive from '@/components/archive/PressArchive.vue'
import RadioArchive from '@/components/archive/RadioArchive.vue'
import FeaturedMagazinesList from '@/components/shared/FeaturedMagazinesList.vue'
import FeaturedPressList from '@/components/shared/FeaturedPressList.vue'
import FeaturedRadioList from '@/components/shared/FeaturedRadioList.vue'
import { usePage } from '@/composables/useSanity'
import { usePageContent } from '@/composables/useCMSData'
import { useSEO } from '@/composables/useSEO'

const { page, fetchPage } = usePage('media')
const { setSEO } = useSEO()

const contentSections = computed(() => usePageContent(page.value)?.value || [])

const featuredMagazines = [
  { title: 'Artist Talk Magazine', location: 'London, United Kingdom', date: 'October 2024' },
  { title: 'Goddessarts Magazine', location: 'Germany', date: 'January 2025' },
  { title: 'Visual Art Journal', location: 'Netherlands', date: 'July 2025' }
]

const featuredPress = [
  { title: 'Vesti.kg', type: 'Press release', date: 'April 21, 2025', headline: '40 Roses by Leah Sanata: Painting Where Light Becomes the Language of Eternity' }
]

const featuredRadio = [
  { title: 'StoryTime', type: 'Radio Interview', date: 'February 26, 2024', headline: 'StoryTime: Radio Interview with Licia Massella' }
]

const fallbackMedia = {
  magazines: [
    { id: 1, label: '2024', title: 'Magazine feature placeholder', meta: 'Add CMS media entries', href: '' }
  ],
  press: [
    { id: 2, label: '2024', title: 'Press mention placeholder', meta: 'Press archive sample', href: '' }
  ],
  radio: [
    { id: 3, label: '2024', title: 'Radio/Podcast placeholder', meta: 'Add link in CMS', href: '' }
  ]
}

const mediaByCategory = (category) =>
  contentSections.value
    .filter(item => item.type === 'media-archive' && item.category === category)
    .flatMap(item => item.items || [])

const magazinesArchive = computed(() => {
  const items = mediaByCategory('magazine')
  return items.length ? items : fallbackMedia.magazines
})

const pressArchive = computed(() => {
  const items = mediaByCategory('press')
  return items.length ? items : fallbackMedia.press
})

const radioArchive = computed(() => {
  const items = mediaByCategory('radio')
  return items.length ? items : fallbackMedia.radio
})

onMounted(async () => {
  await fetchPage('media')

  const seo = page.value?.seo
  if (seo) {
    setSEO({
      title: seo.metaTitle || page.value.title || 'Media',
      description: seo.metaDescription,
      image: seo.metaImage?.data?.attributes?.url
    })
  } else {
    setSEO({
      title: 'Media',
      description: 'Media archive content will be loaded from Sanity.'
    })
  }
})
</script>

<style scoped>
.media-page {
  padding-bottom: var(--spacing-96);
}

.media-header {
  display: grid;
  gap: var(--spacing-12);
}

.media-lede {
  margin: 0;
  max-width: 72ch;
  color: var(--color-text-secondary);
  font-size: var(--font-size-18);
}

.section-title {
  margin: 0 0 var(--spacing-12) 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.section-intro {
  margin: 0;
  font-size: var(--font-size-18);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .media-page {
    padding-bottom: var(--spacing-64);
  }

  .media-lede {
    font-size: var(--font-size-16);
  }

  .section-title {
    font-size: var(--font-size-32);
  }

  .section-intro {
    font-size: var(--font-size-16);
  }
}
</style>
