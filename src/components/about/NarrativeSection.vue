<template>
  <section class="layout-content about-story">
    <div class="about-story__intro">
      <p v-if="subheading" class="about-story__eyebrow">{{ subheading }}</p>
      <blockquote v-if="quote" class="about-story__quote">
        <p>{{ quote }}</p>
        <cite v-if="quoteAuthor" class="about-story__quote-author">{{ quoteAuthor }}</cite>
      </blockquote>
    </div>

    <div class="about-story__body">
      <p v-for="(paragraph, index) in body" :key="index">
        {{ paragraph }}
      </p>
    </div>

    <div v-if="phases && phases.length" class="about-phases">
      <div
        v-for="(phase, index) in phases"
        :key="index"
        class="about-phase"
      >
        <div class="about-phase__title-wrap">
          <h3 class="about-phase__title">{{ phase.title }}</h3>
          <p v-if="phase.period" class="about-phase__period">{{ phase.period }}</p>
        </div>
        <p v-if="phase.description" class="about-phase__description">
          {{ phase.description }}
        </p>
      </div>
    </div>

    <!-- Optional CTA slot -->
    <div v-if="$slots.cta" class="about-story__cta">
      <slot name="cta"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NarrativeSection',
  props: {
    subheading: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      default:
        'The most revolutionary act is simply being authentic to yourself. Through my paintings, I invite viewers to see that profound beauty emerges from this courage.'
    },
    quoteAuthor: {
      type: String,
      default: 'Leah Sanata'
    },
    body: {
      type: Array,
      default: () => [
        'Leah Sanata belongs to a generation of artists who see geography not as a boundary, but as creative fuel. Working from Dubai — a city at the intersection of cultures — she turns mathematical clarity into saturated emotion.',
        'Rejecting formal art school, she built her own methodology through experimentation. By 2021 this became “gradualism” — a meditative, stepwise layering process.',
        'Solo shows across Central Asia and Europe, plus features in Artist Talk Magazine (UK) and Visual Art Journal (NL), mark the current chapter.',
        'Each series is treated as a laboratory where structure and intuition negotiate the final surface.'
      ]
    },
    phases: {
      type: Array,
      default: () => [
        { title: 'Formation', period: '2019–2021', description: 'Independent research, color studies, early gradients.' },
        { title: 'Gradualism', period: '2022–present', description: 'Layered chroma systems, exhibitions abroad, catalogues released.' }
      ]
    }
  }
}
</script>

<style scoped>
.about-story {
  padding-block-start: var(--spacing-96);
  padding-block-end: var(--spacing-96);
  display: grid;
  gap: var(--spacing-64);
}

.about-story__intro {
  display: grid;
  gap: var(--spacing-24);
}

.about-story__eyebrow {
  margin: 0;
  font-size: var(--font-size-16);
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.about-story__quote {
  margin: 0;
  padding: 0;
  border: none;
  border-left: none;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: var(--font-size-24);
  color: var(--color-text-primary);
  line-height: var(--line-height-loose);
}

.about-story__quote p {
  margin: 0;
  font-size: inherit;
}

.about-story__quote-author {
  display: block;
  margin-top: var(--spacing-16);
  font-style: normal;
  font-size: var(--font-size-24);
  text-transform: none;
  letter-spacing: normal;
}

.about-story__body {
  max-width: 75ch;
  display: grid;
  gap: var(--spacing-24);
  color: var(--color-text-primary);
  font-size: var(--font-size-18);
  line-height: var(--line-height-loose);
}

.about-story__body p {
  margin: 0;
}

.about-phases {
  display: grid;
  gap: var(--spacing-24);
  border-top: 1px solid var(--color-border-default);
  padding-top: var(--spacing-32);
}

.about-phase {
  display: grid;
  gap: var(--spacing-8);
}

.about-phase__title-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-12);
  align-items: baseline;
}

.about-phase__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-regular);
}

.about-phase__period {
  margin: 0;
  font-size: var(--font-size-16);
  color: var(--color-text-secondary);
}

.about-phase__description {
  margin: 0;
  color: var(--color-text-primary);
}

.about-story__cta {
  margin-top: var(--spacing-32);
  display: flex;
  justify-content: flex-start;
  line-height: var(--line-height-normal);
}

@media (max-width: 768px) {
  .about-story {
    padding-block-start: var(--spacing-64);
    padding-block-end: var(--spacing-64);
    gap: var(--spacing-48);
  }

  .about-story__quote,
  .about-story__quote-author {
    font-size: var(--font-size-20);
  }

  .about-story__body {
    font-size: var(--font-size-16);
    gap: var(--spacing-20);
  }
}
</style>
