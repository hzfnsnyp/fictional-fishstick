<template>
  <section class="about-bio layout-wide">
    <div class="about-bio__grid">
      <div class="about-bio__main">
        <div class="about-bio__body">
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <aside class="about-bio__aside" aria-label="Artist materials">
        <div v-if="downloads && downloads.length" class="about-bio__panel">
          <h3 class="about-bio__panel-title">Downloads</h3>
          <ul class="about-bio__downloads">
            <li v-for="(item, index) in downloads" :key="index">
              <ClickableTextComponent
                class="about-bio__download-link"
                :href="item.href || undefined"
                :external="true"
              >
                <span class="about-bio__download-label">{{ item.label }}</span>
                <span v-if="item.meta" class="about-bio__download-meta">({{ item.meta }})</span>
              </ClickableTextComponent>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import ClickableTextComponent from '@/components/ui/ClickableTextComponent.vue'

export default {
  name: 'AboutBiographySection',
  components: { ClickableTextComponent },
  props: {
    paragraphs: {
      type: Array,
      default: () => []
    },
    imageSrc: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: ''
    },
    imageCaption: {
      type: String,
      default: ''
    },
    downloads: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.about-bio {
  padding-bottom: var(--spacing-96);
}

@media (max-width: 768px) {
  .about-bio {
    padding-bottom: var(--spacing-64);
  }
}

.about-bio__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);
  gap: var(--spacing-64);
  align-items: start;
}

.about-bio__body {
  display: grid;
  gap: var(--spacing-20);
  color: var(--color-text-primary);
  font-size: var(--font-size-18);
  line-height: var(--line-height-loose);
}

.about-bio__body p {
  margin: 0;
}

.about-bio__aside {
  display: grid;
  gap: var(--spacing-32);
  /* Align top with first line of body text */
  align-self: start;
}

.about-bio__figure {
  margin: 0;
  display: grid;
  gap: var(--spacing-12);
}

.about-bio__figure img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--border-radius-sm, 0);
  background: var(--color-surface-secondary);
}

.about-bio__caption {
  margin: 0;
  font-size: var(--font-size-14);
  color: var(--color-text-secondary);
}

.about-bio__panel {
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  display: grid;
  gap: var(--spacing-16);
}

.about-bio__panel-title {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-20);
}

.about-bio__downloads {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0;
}

.about-bio__downloads li {
  margin: 0;
  padding: 0;
}

.about-bio__download-link {
  color: var(--color-text-primary);
  text-decoration: underline;
  font-size: var(--font-size-18);
  display: inline-flex;
  gap: var(--spacing-4);
  align-items: baseline;
  padding: 0;
  margin: 0;
}

.about-bio__download-link:hover {
  color: var(--color-brand-primary);
}

@media (max-width: 1024px) {
  .about-bio {
    padding-block: var(--spacing-80);
  }

  .about-bio__grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-48);
  }

  .about-bio__title {
    font-size: var(--font-size-40);
  }
}

@media (max-width: 640px) {
  .about-bio {
    padding-block: var(--spacing-56);
  }

  .about-bio__title {
    font-size: var(--font-size-32);
  }
}
</style>
