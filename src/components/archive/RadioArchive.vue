<template>
  <section class="archive-section layout-main radio-archive">
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
  name: 'RadioArchive',
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
</style>
