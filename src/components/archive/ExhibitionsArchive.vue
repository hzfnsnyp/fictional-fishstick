<template>
  <section class="archive-section layout-main exhibitions-archive">
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
</style>
