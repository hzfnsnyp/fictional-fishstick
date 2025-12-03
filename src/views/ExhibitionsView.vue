<template>
  <main class="main-content flow">
    <div class="layout-content">
      <h1 class="page-title">Exhibitions</h1>
    </div>
    <ExhibitionsArchive :exhibitions="exhibitionsArchive" style="--flow-space: var(--spacing-48)" />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ExhibitionsArchive from '@/components/archive/ExhibitionsArchive.vue'
import { useSEO } from '@/composables/useSEO'
import { useExhibitions } from '@/composables/useExhibitions'
import { useExhibitionData } from '@/composables/useCMSData'

const { setSEO } = useSEO()
const { exhibitions, fetchExhibitions } = useExhibitions()

const fallbackExhibitions = [
  { id: 1, label: '2024', title: 'Exhibition placeholder', meta: 'Add exhibitions in Sanity', url: '' }
]

const exhibitionsArchive = computed(() => {
  if (exhibitions.value?.length) {
    return exhibitions.value.map((entry) => {
      const data = useExhibitionData(entry).value
      return {
        id: data.id,
        label: data.year?.toString() || '',
        title: data.title,
        meta: [data.venue, data.location, data.type].filter(Boolean).join(', '),
        url: data.url
      }
    })
  }
  return fallbackExhibitions
})

onMounted(async () => {
  await fetchExhibitions()
  setSEO({
    title: 'Exhibitions',
    description: 'View exhibition history including solo and group shows across Europe.'
  })
})
</script>
