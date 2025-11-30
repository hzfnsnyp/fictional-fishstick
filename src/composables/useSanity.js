/**
 * Composable for managing Sanity CMS data
 * Provides reactive state management for global settings and pages
 */

import { ref } from 'vue'
import { getGlobalStatus, getGlobalSettings, getPageBySlug } from '@/services/api'

// Global state for status
const statusCache = ref(null)
const statusLoading = ref(false)
const statusError = ref(null)

// Global state for settings
const settingsCache = ref(null)
const settingsLoading = ref(false)
const settingsError = ref(null)

/**
 * Global Status composable
 */
export function useGlobalStatus() {
  const fetchStatus = async (forceRefresh = false) => {
    if (statusCache.value && !forceRefresh) {
      return statusCache.value
    }

    statusLoading.value = true
    statusError.value = null

    try {
      const data = await getGlobalStatus()
      statusCache.value = data
      return data
    } catch (err) {
      statusError.value = err.message
      console.error('Failed to fetch global status:', err)
      throw err
    } finally {
      statusLoading.value = false
    }
  }

  return {
    status: statusCache,
    loading: statusLoading,
    error: statusError,
    fetchStatus,
  }
}

/**
 * Global Settings composable
 */
export function useGlobalSettings() {
  const fetchSettings = async (forceRefresh = false) => {
    if (settingsCache.value && !forceRefresh) {
      return settingsCache.value
    }

    settingsLoading.value = true
    settingsError.value = null

    try {
      const data = await getGlobalSettings()
      settingsCache.value = data
      return data
    } catch (err) {
      settingsError.value = err.message
      console.error('Failed to fetch global settings:', err)
      throw err
    } finally {
      settingsLoading.value = false
    }
  }

  return {
    settings: settingsCache,
    loading: settingsLoading,
    error: settingsError,
    fetchSettings,
  }
}

/**
 * Page composable
 */
export function usePage(slugOrId) {
  const page = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchPage = async (pageSlug = slugOrId) => {
    loading.value = true
    error.value = null

    try {
      const data = await getPageBySlug(pageSlug)
      page.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Failed to fetch page "${pageSlug}":`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    page,
    loading,
    error,
    fetchPage,
  }
}
