/**
 * Composable for managing Series from Sanity CMS
 */

import { ref } from 'vue'
import { getSeries, getFeaturedSeries } from '@/services/api'

export function useSeries() {
  const series = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch all series
   */
  const fetchSeries = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await getSeries()
      series.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch series:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch featured series
   * @param {number} limit - Number of series to fetch
   */
  const fetchFeaturedSeries = async (limit = 3) => {
    loading.value = true
    error.value = null

    try {
      const data = await getFeaturedSeries(limit)
      series.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch featured series:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    series,
    loading,
    error,
    fetchSeries,
    fetchFeaturedSeries,
  }
}

export default useSeries
