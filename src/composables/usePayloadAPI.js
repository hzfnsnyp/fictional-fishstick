/**
 * Base composable for Payload CMS API interactions
 * Provides common fetch functionality with error handling
 */

import { ref } from 'vue';

const API_BASE_URL = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3000/api';

/**
 * Generic fetch function for Payload API
 * @param {string} endpoint - API endpoint (e.g., 'artworks', 'series')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - API response data
 */
async function fetchFromPayload(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Payload API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Base composable for Payload API collections
 * @param {string} collection - Collection name
 * @returns {object} - Reactive state and methods
 */
export function usePayloadAPI(collection) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fetch all items from collection
   * @param {object} params - Query parameters (limit, page, where, etc.)
   */
  const fetchAll = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.where) queryParams.append('where', JSON.stringify(params.where));
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.depth !== undefined) queryParams.append('depth', params.depth);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${collection}?${queryString}` : collection;

      const result = await fetchFromPayload(endpoint);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single item by ID
   * @param {string} id - Item ID
   * @param {object} params - Query parameters (depth, etc.)
   */
  const fetchById = async (id, params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams();
      if (params.depth !== undefined) queryParams.append('depth', params.depth);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `${collection}/${id}?${queryString}`
        : `${collection}/${id}`;

      const result = await fetchFromPayload(endpoint);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single item by slug
   * @param {string} slug - Item slug
   * @param {object} params - Query parameters
   */
  const fetchBySlug = async (slug, params = {}) => {
    return fetchAll({
      ...params,
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    });
  };

  return {
    data,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchBySlug,
  };
}

/**
 * Fetch global settings
 * @param {string} slug - Global slug (e.g., 'settings')
 */
export async function fetchGlobal(slug) {
  return fetchFromPayload(`globals/${slug}`);
}

export default usePayloadAPI;
