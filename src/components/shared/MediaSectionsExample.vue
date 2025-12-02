<template>
  <div class="media-sections-example">

    <!-- Magazines Section -->
    <section class="media-section section-pad-loose" aria-labelledby="magazines-title">
      <div class="layout-content flow flow-xl">
        <header class="flow flow-sm prose">
          <h2 id="magazines-title" class="section-category">Magazines</h2>
        </header>

        <div class="media-list">
          <MagazineItem
            v-for="magazine in magazines"
            :key="magazine.id"
            :magazine="magazine"
            @click="handleMediaClick"
          />
        </div>
      </div>
    </section>

    <!-- Press & Media Section -->
    <section class="media-section section-pad-loose" aria-labelledby="press-title">
      <div class="layout-content flow flow-xl">
        <header class="flow flow-sm prose">
          <h2 id="press-title" class="section-category">Press & Media</h2>
        </header>

        <div class="media-list">
          <PressMediaItem
            v-for="press in pressMedia"
            :key="press.id"
            :press="press"
            @click="handleMediaClick"
          />
        </div>
      </div>
    </section>

    <!-- Radio Section -->
    <section class="media-section section-pad-loose" aria-labelledby="radio-title">
      <div class="layout-content flow flow-xl">
        <header class="flow flow-sm prose">
          <h2 id="radio-title" class="section-category">Radio</h2>
        </header>

        <div class="media-list">
          <RadioItem
            v-for="radio in radioInterviews"
            :key="radio.id"
            :radio="radio"
            @click="handleMediaClick"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import MagazineItem from '@/components/shared/MagazineItem.vue'
import PressMediaItem from '@/components/shared/PressMediaItem.vue'
import RadioItem from '@/components/shared/RadioItem.vue'

export default {
  name: 'MediaSectionsExample',
  components: {
    MagazineItem,
    PressMediaItem,
    RadioItem
  },
  data() {
    return {
      magazines: [
        {
          id: 1,
          name: 'Artist Talk Magazine',
          meta: 'London, United Kingdom, October 2024',
          title: 'Contemporary Artist Feature',
          description: 'In-depth profile exploring the intersection of classical technique and modern abstraction.',
          url: 'https://example.com/article'
        },
        {
          id: 2,
          name: 'Art Forum International',
          meta: 'New York, USA, September 2024',
          title: 'Rising Voices in Abstract Painting',
          url: 'https://example.com/article'
        }
      ],
      pressMedia: [
        {
          id: 1,
          name: 'Vesti.kg',
          meta: 'Press release, April 21, 2025',
          title: '40 Roses by Leah Sanata: Painting Where Light Becomes the Language of Eternity',
          subtitle: '(40 роз Leah Sanata: живопись, где свет становится языком Вечности)',
          url: 'https://example.com/press'
        },
        {
          id: 2,
          name: 'Art Daily News',
          meta: 'Online feature, March 15, 2025',
          title: 'New Exhibition Explores Chromatic Harmony',
          subtitle: '(Новая выставка исследует хроматическую гармонию)'
        }
      ],
      radioInterviews: [
        {
          id: 1,
          name: 'Sputnik Kyrgyzstan',
          meta: 'Radio Interview, May 16, 2025',
          title: 'Spring, Flowers, and Art: An Exhibition Worth Seeing',
          subtitle: '(Весна, цветы и искусство: выставка, которую следует увидеть)',
          url: 'https://example.com/radio'
        },
        {
          id: 2,
          name: 'Culture Radio',
          meta: 'Podcast Interview, April 2, 2025',
          title: 'The Artist\'s Voice: Contemporary Practice',
          subtitle: '(Голос художника: современная практика)'
        }
      ]
    }
  },
  methods: {
    handleMediaClick(item) {
      console.log('Media clicked:', item)
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer')
      } else if (item.to) {
        this.$router.push(item.to)
      }
    }
  }
}
</script>

<style scoped>
.section-category {
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.media-section {
  background: var(--color-surface-primary);
}

.media-section:nth-child(even) {
  background: var(--color-surface-secondary);
}

.media-list {
  /* Items have their own spacing */
}
</style>
