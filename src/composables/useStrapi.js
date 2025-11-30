/**
 * Vue Composable for Sanity CMS
 * Reactive data fetching with caching
 */

import { ref, computed } from 'vue'
import * as api from '@/services/api'

/**
 * Use Global Status (maintenance mode check)
 */
export function useGlobalStatus() {
  const status = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const isMaintenanceMode = computed(() => status.value?.maintenanceMode || false)
  
  async function fetchStatus() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getGlobalStatus()
      status.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch global status:', err)
    } finally {
      loading.value = false
    }
  }
  
  return {
    status,
    loading,
    error,
    isMaintenanceMode,
    fetchStatus,
    refresh: fetchStatus
  }
}

/**
 * Use Global Settings
 */
export function useGlobalSettings() {
  const settings = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchSettings() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getGlobalSettings()
      settings.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch global settings:', err)
    } finally {
      loading.value = false
    }
  }
  
  return {
    settings,
    loading,
    error,
    fetchSettings,
    refresh: fetchSettings
  }
}

/**
 * Use Artworks
 */
export function useArtworks() {
  const artworks = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchArtworks() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getArtworks()
      artworks.value = data || []
    } catch (err) {
      error.value = err
      console.error('Failed to fetch artworks:', err)
      artworks.value = []
    } finally {
      loading.value = false
    }
  }
  
  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    refresh: fetchArtworks
  }
}

/**
 * Use Single Artwork
 */
export function useArtwork(idOrSlug = null) {
  const artwork = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchArtwork(id) {
    loading.value = true
    error.value = null
    
    try {
      const data = typeof id === 'number'
        ? await api.getArtwork(id)
        : await api.getArtworkBySlug(id)
      
      artwork.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch artwork:', err)
      artwork.value = null
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch if ID provided
  if (idOrSlug) {
    fetchArtwork(idOrSlug)
  }
  
  return {
    artwork,
    loading,
    error,
    fetchArtwork,
    refresh: () => fetchArtwork(idOrSlug)
  }
}

/**
 * Use Series
 */
export function useSeries() {
  const series = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchSeries() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getSeries()
      series.value = data || []
    } catch (err) {
      error.value = err
      console.error('Failed to fetch series:', err)
      series.value = []
    } finally {
      loading.value = false
    }
  }
  
  return {
    series,
    loading,
    error,
    fetchSeries,
    refresh: fetchSeries
  }
}

/**
 * Use Single Series
 */
export function useSeriesItem(idOrSlug = null) {
  const series = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchSeries(id) {
    loading.value = true
    error.value = null
    
    try {
      const data = typeof id === 'number'
        ? await api.getSeriesById(id)
        : await api.getSeriesBySlug(id)
      
      series.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch series:', err)
      series.value = null
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch if ID provided
  if (idOrSlug) {
    fetchSeries(idOrSlug)
  }
  
  return {
    series,
    loading,
    error,
    fetchSeries,
    refresh: () => fetchSeries(idOrSlug)
  }
}

/**
 * Use Exhibitions
 */
export function useExhibitions() {
  const exhibitions = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchExhibitions() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getExhibitions()
      exhibitions.value = data || []
    } catch (err) {
      error.value = err
      console.error('Failed to fetch exhibitions:', err)
      exhibitions.value = []
    } finally {
      loading.value = false
    }
  }
  
  return {
    exhibitions,
    loading,
    error,
    fetchExhibitions,
    refresh: fetchExhibitions
  }
}

/**
 * Use Page by Slug
 */
export function usePage(slug = null) {
  const page = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchPage(pageSlug) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getPageBySlug(pageSlug)
      page.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch page:', err)
      page.value = null
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch if slug provided
  if (slug) {
    fetchPage(slug)
  }
  
  return {
    page,
    loading,
    error,
    fetchPage,
    refresh: () => fetchPage(slug)
  }
}

/**
 * Use Search
 */
export function useSearch() {
  const results = ref({
    artworks: [],
    series: [],
    exhibitions: []
  })
  const loading = ref(false)
  const error = ref(null)
  const query = ref('')
  
  async function search(searchQuery, types = ['artworks', 'series', 'exhibitions']) {
    query.value = searchQuery
    
    if (!searchQuery || searchQuery.length < 2) {
      results.value = {
        artworks: [],
        series: [],
        exhibitions: []
      }
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const data = await api.searchContent(searchQuery, types)
      results.value = {
        artworks: data.artworks || [],
        series: data.series || [],
        exhibitions: data.exhibitions || []
      }
    } catch (err) {
      error.value = err
      console.error('Search failed:', err)
      results.value = {
        artworks: [],
        series: [],
        exhibitions: []
      }
    } finally {
      loading.value = false
    }
  }
  
  const totalResults = computed(() => {
    return (
      results.value.artworks.length +
      results.value.series.length +
      results.value.exhibitions.length
    )
  })
  
  return {
    results,
    loading,
    error,
    query,
    search,
    totalResults
  }
}
