<template>
  <section class="featured-exhibition">
    <div :class="['featured-exhibition__container', containerClass]">
      <!-- Content Section -->
      <div class="featured-exhibition__content">
        <!-- Section Label -->
        <div class="featured-exhibition__label">
          {{ exhibition.category }}
        </div>

        <!-- Main Content -->
        <div class="featured-exhibition__main">
          <h2 class="featured-exhibition__title">
            {{ exhibition.title }}
          </h2>
          
          <p class="featured-exhibition__description">
            {{ exhibition.description }}
          </p>

          <!-- Call to Action -->
          <div class="featured-exhibition__actions">
            <ButtonComponent 
              variant="primary" 
              size="medium"
              @click="handleLearnMore"
            >
              Learn More
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="featured-exhibition__image-section">
        <div class="featured-exhibition__image-container">
          <img
            :src="exhibition.image"
            :alt="exhibition.title"
            class="featured-exhibition__image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import ButtonComponent from '../ui/ButtonComponent.vue'
import { mapContainer } from '@/utils/containerClass'

export default defineComponent({
  name: 'FeaturedExhibitionSection',
  components: { ButtonComponent },
  props: {
    container: { type: String, default: 'main' },
    exhibition: {
      type: Object,
      default: () => ({
        id: 1,
        category: 'Every Saturday, Free Admission to the Museum',
        title: 'Every Saturday from 4 pm, visit the exhibitions, rediscover the Collection, and take part in activities, guided tours, concerts and performances...',
        description: 'Join us every weekend for an immersive cultural experience. Explore our rotating exhibitions, engage with interactive displays, and participate in expert-led discussions about contemporary art and its intersection with society.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
        link: '/exhibitions/current'
      })
    }
  },
  emits: ['learn-more'],
  computed: {
    containerClass() { return mapContainer(this.container) }
  },
  setup(props, { emit }) {
    const handleLearnMore = () => {
      emit('learn-more', props.exhibition)
    }

    return {
      handleLearnMore
    }
  }
})
</script>

<style scoped>
/* ==========================================================================
   FEATURED EXHIBITION SECTION
   ========================================================================== */
.featured-exhibition {
  padding-top: var(--spacing-96); /* 96px */
  padding-bottom: var(--spacing-96); /* 96px */
  background: var(--color-surface-primary);
}

/* ==========================================================================
   CONTAINER - Wide layout with max-width
   ========================================================================== */
.featured-exhibition__container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 50/50 split */
  gap: var(--spacing-96); /* 96px gap between content and image */
  align-items: center;
}

/* ==========================================================================
   CONTENT SECTION - Left side
   ========================================================================== */
.featured-exhibition__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-48); /* 48px between sections */
}

/* Section Label - Small uppercase text */
.featured-exhibition__label {
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 16px */
  font-weight: var(--font-weight-regular); /* 400 */
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

/* Main content area */
.featured-exhibition__main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-48); /* 48px between elements */
}

/* Title - Large, impactful */
.featured-exhibition__title {
  font-family: var(--font-heading); /* Publico Headline */
  font-size: var(--font-size-46); /* 44px */
  font-weight: var(--font-weight-light); /* 300 */
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin: 0;
}

/* Description text */
.featured-exhibition__description {
  font-family: var(--font-body); /* Noto Sans */
  font-size: var(--font-size-18); /* 18px */
  font-weight: var(--font-weight-regular); /* 400 */
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  margin: 0;
}

/* Action buttons */
.featured-exhibition__actions {
  display: flex;
  gap: var(--spacing-32); /* 32px between buttons if multiple */
}

/* ==========================================================================
   IMAGE SECTION - Right side
   ========================================================================== */
.featured-exhibition__image-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 600px; /* Ensure minimum height */
}

.featured-exhibition__image-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-secondary);
}

.featured-exhibition__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

@media (hover: hover) and (pointer: fine) {
  .featured-exhibition__image:hover {
    transform: scale(1.02); /* Subtle zoom on hover */
  }
}

/* ==========================================================================
   RESPONSIVE DESIGN
   ========================================================================== */

/* Large screens (1280px+) */
@media (min-width: 1280px) {
  .featured-exhibition {
    padding-top: calc(var(--spacing-96) * 1.5); /* 144px */
    padding-bottom: calc(var(--spacing-96) * 1.5); /* 144px */
  }

  .featured-exhibition__container { gap: calc(var(--spacing-96) * 1.5); /* 144px gap */ }

  .featured-exhibition__title {
    font-size: var(--font-size-60); /* 52px on large screens */
  }

  .featured-exhibition__image-section {
    min-height: 700px; /* Taller on large screens */
  }
}

/* Tablets (768px - 1023px) */
@media (max-width: 1023px) {
  .featured-exhibition__container { gap: var(--spacing-64); /* 64px gap */ }

  .featured-exhibition__title {
    font-size: var(--font-size-38); /* 36px on tablets */
  }

  .featured-exhibition__image-section {
    min-height: 500px; /* Shorter on tablets */
  }
}

/* Mobile (max-width: 767px) - Stack layout */
@media (max-width: 767px) {
  .featured-exhibition {
    padding-top: var(--spacing-64); /* 64px */
    padding-bottom: var(--spacing-64); /* 64px */
  }

  .featured-exhibition__container {
    grid-template-columns: 1fr; /* Single column */
    grid-template-rows: auto auto; /* Stack content and image */
    gap: var(--spacing-64); /* 64px between stacked sections */
  }

  .featured-exhibition__content {
    gap: var(--spacing-32); /* 32px between sections */
  }

  .featured-exhibition__main {
    gap: var(--spacing-32); /* 32px between elements */
  }

  .featured-exhibition__title {
    font-size: var(--font-size-28); /* 28px on mobile */
  }

  .featured-exhibition__description {
    font-size: var(--font-size-18); /* 18px on mobile */
  }

  .featured-exhibition__image-section {
    min-height: 400px; /* Shorter on mobile */
    order: 1; /* Image first on mobile */
  }

  .featured-exhibition__content {
    order: 2; /* Content second on mobile */
  }
}

/* Small mobile (max-width: 480px) */
@media (max-width: 480px) {
  .featured-exhibition__container { gap: var(--spacing-48); /* 48px */ }

  .featured-exhibition__title {
    font-size: var(--font-size-24); /* 24px on small mobile */
  }

  .featured-exhibition__image-section {
    min-height: 300px; /* Even shorter on small mobile */
  }
}

/* ==========================================================================
   ALTERNATIVE LAYOUTS - For future use
   ========================================================================== */

/* Image-first layout modifier */
.featured-exhibition--image-first .featured-exhibition__container {
  grid-template-columns: 1fr 1fr;
}

.featured-exhibition--image-first .featured-exhibition__image-section {
  order: 1;
}

.featured-exhibition--image-first .featured-exhibition__content {
  order: 2;
}

/* Full-width layout modifier */
.featured-exhibition--full-width .featured-exhibition__container {
  max-width: none;
}

/* Compact layout modifier */
.featured-exhibition--compact {
  padding-top: var(--spacing-64); /* 64px */
  padding-bottom: var(--spacing-64); /* 64px */
}

.featured-exhibition--compact .featured-exhibition__image-section {
  min-height: 400px;
}

.featured-exhibition--compact .featured-exhibition__title {
  font-size: var(--font-size-38); /* Smaller title */
}
</style>
