<template>
  <section class="archive-section layout-main magazines-archive">
    <header class="archive-section__header">
      <h1>Magazines</h1>
    </header>

    <div v-for="(group, year) in groupedItems" :key="year" class="archive-group">
      <ArchiveRow
        v-for="(item, index) in group"
        :key="item.id"
        :label="index === 0 ? year : ''"
        :title="item.title"
        :meta="item.meta"
        :href="item.href || ''"
        :external="Boolean(item.href)"
      />
    </div>
  </section>
</template>

<script>
import ArchiveRow from './ArchiveRow.vue'

export default {
  name: 'MagazinesArchive',
  components: { ArchiveRow },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    groupedItems() {
      const grouped = {}
      this.items.forEach(item => {
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
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-38);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .archive-section__header h1 {
    font-size: var(--font-size-32);
  }
}
</style>
