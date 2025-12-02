/**
 * Composable for managing Artworks from Sanity CMS
 */

import { ref } from 'vue'
import { getArtworks, getFeaturedArtworks } from '@/services/api'

export function useArtworks() {
  const artworks = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch all artworks
   */
  const fetchArtworks = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await getArtworks()
      artworks.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch artworks:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch featured artworks
   * @param {number} limit - Number of artworks to fetch
   */
  const fetchFeaturedArtworks = async (limit = 6) => {
    loading.value = true
    error.value = null

    try {
      const data = await getFeaturedArtworks(limit)
      artworks.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch featured artworks:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    fetchFeaturedArtworks,
  }
}

export default useArtworks
