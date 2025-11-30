/**
 * Composable for managing Exhibitions from Sanity CMS
 */

import { ref } from 'vue'
import { getExhibitions, getFeaturedExhibition } from '@/services/api'

export function useExhibitions() {
  const exhibitions = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch all exhibitions
   */
  const fetchExhibitions = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await getExhibitions()
      exhibitions.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch exhibitions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch featured exhibition
   */
  const fetchFeaturedExhibition = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await getFeaturedExhibition()
      exhibitions.value = data ? [data] : []
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch featured exhibition:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    exhibitions,
    loading,
    error,
    fetchExhibitions,
    fetchFeaturedExhibition,
  }
}

export default useExhibitions
