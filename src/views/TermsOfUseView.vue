<template>
  <main class="main-content flow main-content--flow-none terms-page">
    <section class="layout-main terms-intro">
      <div class="layout-narrow terms-intro__inner">
        <h1>Terms of Use</h1>
        <p class="terms-lede">
          The following outline previews the structure of the future Terms of Use for Leah Sanata Studio. It clarifies expectations for visiting, commissioning or purchasing through the site while we finalise the legal text with counsel.
        </p>
        <p class="terms-meta">Last revised: {{ lastUpdated }}</p>

        <CollapsibleSection title="Contents" :default-expanded="true" variant="compact">
          <ul class="terms-toc">
            <li v-for="section in tocSections" :key="section.anchor">
              <a :href="section.anchor">{{ section.title }}</a>
            </li>
          </ul>
        </CollapsibleSection>
      </div>
    </section>

    <section class="layout-main terms-body">
      <div class="layout-narrow terms-body__inner">
        <article id="terms-1" class="terms-article">
          <h2 class="terms-article__title">1. Overview</h2>
          <p>
            The website and any associated newsletters are operated by Leah Sanata Studio. Accessing this site signifies your agreement to follow the terms and policies published here. These terms supplement any written contract you may sign when acquiring artworks or commissioning services.
          </p>
        </article>

        <article id="terms-2" class="terms-article">
          <h2 class="terms-article__title">2. Using the site</h2>
          <p>
            You may browse the portfolio, download publicly available materials, and share links for personal reference. You agree not to copy large portions of the site, automate data collection, or disrupt the performance or security of our services.
          </p>
        </article>

        <article id="terms-3" class="terms-article">
          <h2 class="terms-article__title">3. Intellectual property</h2>
          <p>
            All artworks, text, photography, video, design elements, and code are protected by copyright and remain the property of Leah Sanata Studio or credited collaborators. Please request written permission before reproducing content beyond personal reference.
          </p>
        </article>

        <article id="terms-4" class="terms-article">
          <h2 class="terms-article__title">4. Orders and payments</h2>
          <p>
            Availability of artworks is subject to confirmation. Prices may change without notice until a sales agreement is executed. Payment instructions, delivery timelines, and applicable taxes or duties will be provided during the order process.
          </p>
        </article>

        <article id="terms-5" class="terms-article">
          <h2 class="terms-article__title">5. Limitation of liability</h2>
          <p>
            The site and its content are provided on an "as is" basis. We make reasonable efforts to keep information current but do not guarantee accuracy or availability at all times. To the extent permitted by law, the Studio is not liable for losses arising from use of this site or from third-party links.
          </p>
        </article>

        <article id="terms-6" class="terms-article">
          <h2 class="terms-article__title">6. Changes and contact</h2>
          <p>
            We may update these terms from time to time. Significant changes will be announced on the site or via newsletter. Questions can be directed to <a href="mailto:studio@leahsanata.studio">studio@leahsanata.studio</a>.
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import CollapsibleSection from '@/components/ui/CollapsibleSection.vue'

const tocSections = [
  { title: '1. Overview', anchor: '#terms-1' },
  { title: '2. Using the site', anchor: '#terms-2' },
  { title: '3. Intellectual property', anchor: '#terms-3' },
  { title: '4. Orders and payments', anchor: '#terms-4' },
  { title: '5. Limitation of liability', anchor: '#terms-5' },
  { title: '6. Changes and contact', anchor: '#terms-6' }
]

export default {
  name: 'TermsOfUseView',
  components: { CollapsibleSection },
  data() {
    return {
      tocSections,
      lastUpdated: 'May 2026'
    }
  }
}
</script>

<style scoped>
.terms-page {
  padding-bottom: var(--spacing-96);
}

.terms-intro {
  padding-block: 0;
}

.terms-intro__inner {
  display: grid;
  gap: var(--spacing-32);
}

.terms-lede {
  margin: 0;
}

.terms-meta {
  margin: 0;
  font-size: var(--font-size-18);
  color: var(--color-text-secondary);
}

.terms-toc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--spacing-16);
}

.terms-toc a {
  color: var(--color-text-primary);
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .terms-toc a:hover {
    text-decoration: underline;
  }
}

.terms-body {
  padding-block: 0;
}

.terms-body__inner {
  display: grid;
  gap: var(--spacing-48);
}

.terms-article {
  display: grid;
  gap: var(--spacing-12);
}

.terms-article__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-light);
}
</style>
