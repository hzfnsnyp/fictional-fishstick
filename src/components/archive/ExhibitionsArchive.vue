<template>
  <section class="archive-section layout-content exhibitions-archive">
    <header class="archive-section__header">
      <h1>Exhibitions</h1>
      <p class="archive-section__intro">Recent and past shows.</p>
    </header>

    <div v-for="(group, year) in groupedExhibitions" :key="year" class="archive-group">
      <ArchiveRow
        v-for="(item, index) in group"
        :key="item.id"
        :label="index === 0 ? year : ''"
        :title="item.title"
        :meta="item.meta"
        :href="item.url || ''"
        :external="Boolean(item.url)"
      />
    </div>
  </section>
</template>

<script>
import ArchiveRow from './ArchiveRow.vue'

export default {
  name: 'ExhibitionsArchive',
  components: { ArchiveRow },
  props: {
    exhibitions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    groupedExhibitions() {
      const grouped = {}
      this.exhibitions.forEach(item => {
        const year = item.label
        if (!grouped[year]) {
          grouped[year] = []
        }
        grouped[year].push(item)
      })
      return grouped
    }
  }
}
</script>

<style scoped>
.archive-section {
  margin-block: var(--spacing-64);
  font-family: var(--font-body);
}

.archive-section__header {
  margin-bottom: var(--spacing-48);
}

.archive-section__header h1 {
  margin: 0 0 var(--spacing-12) 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.archive-section__intro {
  margin: 0;
  font-size: var(--font-size-18);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .archive-section__header h1 {
    font-size: var(--font-size-32);
  }

  .archive-section__intro {
    font-size: var(--font-size-16);
  }
}
</style>
