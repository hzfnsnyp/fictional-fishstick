<template>
  <main class="main-content flow main-content--flow-loose">
    <section class="layout-main">
      <h1>Blocks Inventory</h1>
      <p class="text-muted">All major blocks rendered for inspection.</p>
      <div class="inline">
        <span class="block-caption">Container:</span>
        <button class="btn" :class="{active: containerChoice==='main'}" @click="containerChoice='main'">main</button>
        <button class="btn" :class="{active: containerChoice==='content'}" @click="containerChoice='content'">content</button>
        <button class="btn" :class="{active: containerChoice==='narrow'}" @click="containerChoice='narrow'">narrow</button>
        <button class="btn" :class="{active: containerChoice==='wide'}" @click="containerChoice='wide'">wide</button>
        <button class="btn" :class="{active: containerChoice==='none'}" @click="containerChoice='none'">none</button>
      </div>
    </section>

    <!-- Hero -->
    <section>
      <div class="layout-main"><p class="block-caption">components/home/HeroBlock.vue</p></div>
      <HeroBlock
        image-src="/artworks/plate (11)-edit.jpg"
        image-alt="Arc Silhouette"
        title="Arc Silhouette"
        year="2022"
        medium="Bronze"
        dimensions="55 × 35 × 30 cm"
      />
    </section>

    <!-- Home sections -->
    <section>
      <div class="layout-main"><p class="block-caption">components/home/HeroSection.vue</p></div>
      <HeroSection
        :container="containerChoice"
        image-src="/artworks/plate (5)-edit.jpg"
        image-alt="Geometric Harmony"
        artwork-title="Geometric Harmony"
        year="2023"
        medium="Mixed media on canvas"
        dimensions="120 × 120 cm"
      />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/home/RecentExhibitionsSection.vue</p></div>
      <RecentExhibitionsSection :container="containerChoice" />
    </section>

    <!-- About sections -->
    <section>
      <div class="layout-main"><p class="block-caption">components/about/ArtistStatementSection.vue</p></div>
      <ArtistStatementSection :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/about/FeaturedExhibitionSection.vue</p></div>
      <FeaturedExhibitionSection :container="containerChoice" />
    </section>

    <!-- Artworks -->
    <section>
      <div class="layout-main"><p class="block-caption">components/artworks/ArtworksGrid.vue</p></div>
      <ArtworksGrid :artworks="demoArtworks" @artwork-click="noop" />
    </section>

    <!-- Exhibitions Archive -->
    <section>
      <div class="layout-main"><p class="block-caption">components/archive/ExhibitionsArchive.vue</p></div>
      <ExhibitionsArchive :exhibitions="demoExhibitions" />
    </section>

    <!-- Contact form -->
    <section>
      <div class="layout-main"><p class="block-caption">components/contact/ContactForm.vue</p></div>
      <ContactForm />
    </section>

    <!-- Test layouts -->
    <section>
      <div class="layout-main"><p class="block-caption">components/home/PracticeHighlightsSection.vue</p></div>
      <PracticeHighlightsSection :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/test-layouts/TestLayout03BiographyIntro.vue</p></div>
      <TestLayout03BiographyIntro :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/home/SeriesOverviewSection.vue</p></div>
      <SeriesOverviewSection :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/test-layouts/TestLayout05CollageQuote.vue</p></div>
      <TestLayout05CollageQuote :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/home/StudioEssaySection.vue</p></div>
      <StudioEssaySection :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/home/TechniquesOverviewSection.vue</p></div>
      <TechniquesOverviewSection :container="containerChoice" />
    </section>
    <section>
      <div class="layout-main"><p class="block-caption">components/test-layouts/TestLayoutsGallery.vue</p></div>
      <TestLayoutsGallery />
    </section>
  </main>
</template>

<script>
import HeroBlock from '@/components/home/HeroBlock.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import PracticeHighlightsSection from '@/components/home/PracticeHighlightsSection.vue'
import RecentExhibitionsSection from '@/components/home/RecentExhibitionsSection.vue'
import SeriesOverviewSection from '@/components/shared/SeriesOverviewSection.vue'
import EssaySection from '@/components/shared/EssaySection.vue'
import TechniquesOverviewSection from '@/components/shared/TechniquesOverviewSection.vue'

import ArtistStatementSection from '@/components/about/ArtistStatementSection.vue'
import FeaturedExhibitionSection from '@/components/shared/FeaturedExhibitionSection.vue'

import ArtworksGrid from '@/components/artworks/ArtworksGrid.vue'

import ExhibitionsArchive from '@/components/archive/ExhibitionsArchive.vue'
import ContactForm from '@/components/contact/ContactForm.vue'

// Test layouts
import TestLayout03BiographyIntro from '@/components/test-layouts/TestLayout03BiographyIntro.vue'
import TestLayout05CollageQuote from '@/components/test-layouts/TestLayout05CollageQuote.vue'
import TestLayoutsGallery from '@/components/test-layouts/TestLayoutsGallery.vue'

export default {
  name: 'BlocksInventoryView',
  components: {
    HeroBlock,
    HeroSection,
    PracticeHighlightsSection,
    RecentExhibitionsSection,
    SeriesOverviewSection,
    EssaySection,
    TechniquesOverviewSection,
    ArtistStatementSection,
    FeaturedExhibitionSection,
    ArtworksGrid,
    ExhibitionsArchive,
    ContactForm,
    TestLayout03BiographyIntro,
    TestLayout05CollageQuote,
    TestLayoutsGallery
  },
  data() {
    return {
      containerChoice: 'main',
      demoArtworks: undefined,
      demoExhibitions: [
        { id: 1, label: '2024', title: 'Metamorphic Landscapes', meta: 'Galerie Moderne, Paris, Solo Exhibition' },
        { id: 2, label: '2024', title: 'Light Studies', meta: 'Contemporary Space, Amsterdam, Group Exhibition' },
        { id: 3, label: '2023', title: 'Emerging Voices', meta: 'Contemporary Art Center, Berlin, Group Exhibition' }
      ]
    }
  },
  methods: {
    noop() {}
  }
}
</script>

<style scoped>
h1, h2 { margin: 0 0 var(--spacing-20) 0; }
.block-caption {
  margin: 0 0 var(--spacing-16) 0;
  font-family: var(--font-body);
  font-size: var(--font-size-14);
  color: var(--color-text-muted);
}
.inline { display: inline-flex; gap: var(--spacing-16); align-items: center; }
.btn { border: 1px solid var(--color-border); background: transparent; padding: 4px 8px; cursor: pointer; }
.btn.active { background: var(--color-surface-secondary); }
</style>
