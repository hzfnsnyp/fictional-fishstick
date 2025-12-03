<template>
  <main class="main-content flow main-content--flow-loose media-page">
    <h1 class="sr-only">Media Archive</h1>

    <section class="layout-content media-header">
      <p class="media-eyebrow">Media</p>
      <h2 class="media-title">Archive</h2>
      <p class="media-lede">
        Catalogs, publications, press, and broadcasts documenting the practice.
      </p>
    </section>

    <FeaturedMagazinesList container="wide" :items="featuredMagazines" />
    <FeaturedPressList container="wide" :items="featuredPress" />
    <FeaturedRadioList container="wide" :items="featuredRadio" />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import FeaturedMagazinesList from '@/components/shared/FeaturedMagazinesList.vue'
import FeaturedPressList from '@/components/shared/FeaturedPressList.vue'
import FeaturedRadioList from '@/components/shared/FeaturedRadioList.vue'
import { usePage } from '@/composables/useStrapi'
import { useSEO } from '@/composables/useSEO'

const { page, fetchPage } = usePage('media')
const { setSEO } = useSEO()

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
      description: 'Media archive content will be loaded from Strapi.'
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
  padding-top: var(--spacing-80);
  padding-bottom: var(--spacing-32);
}

.media-eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  font-size: var(--font-size-14);
}

.media-title {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--font-weight-light);
  font-size: var(--font-size-48);
}

.media-lede {
  margin: 0;
  max-width: 72ch;
  color: var(--color-text-secondary);
  font-size: var(--font-size-18);
}

@media (max-width: 768px) {
  .media-page {
    padding-bottom: var(--spacing-64);
  }

  .media-header {
    padding-top: var(--spacing-56);
  }

  .media-title {
    font-size: var(--font-size-38);
  }

  .media-lede {
    font-size: var(--font-size-16);
  }
}
</style>
