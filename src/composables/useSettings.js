/**
 * Composable for managing Site Settings from Payload CMS
 */

import { ref } from 'vue';
import { fetchGlobal } from './usePayloadAPI';

const settingsCache = ref(null);
const loading = ref(false);
const error = ref(null);

export function useSettings() {
  /**
   * Fetch site settings
   * Uses cache to avoid redundant API calls
   */
  const getSettings = async (forceRefresh = false) => {
    // Return cached settings if available
    if (settingsCache.value && !forceRefresh) {
      return settingsCache.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const result = await fetchGlobal('settings');
      settingsCache.value = result;
      return result;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get specific setting value
   * @param {string} path - Setting path (e.g., 'general.siteName')
   */
  const getSetting = (path) => {
    if (!settingsCache.value) return null;

    const parts = path.split('.');
    let value = settingsCache.value;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }

    return value;
  };

  /**
   * Clear settings cache
   */
  const clearCache = () => {
    settingsCache.value = null;
  };

  return {
    settings: settingsCache,
    loading,
    error,
    getSettings,
    getSetting,
    clearCache,
  };
}

export default useSettings;
