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
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import FeaturedMagazinesList from '@/components/shared/FeaturedMagazinesList.vue'
import FeaturedPressList from '@/components/shared/FeaturedPressList.vue'
import FeaturedRadioList from '@/components/shared/FeaturedRadioList.vue'
import { usePage } from '@/composables/useSanity'
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
