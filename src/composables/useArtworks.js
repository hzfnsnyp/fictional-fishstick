/**
 * Composable for managing Artworks from Payload CMS
 */

import { usePayloadAPI } from './usePayloadAPI';

export function useArtworks() {
  const {
    data: artworks,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchBySlug,
  } = usePayloadAPI('artworks');

  /**
   * Fetch all artworks with optional filters
   * @param {object} options - Filter options
   * @param {string} options.seriesId - Filter by series ID
   * @param {string} options.status - Filter by status
   * @param {number} options.limit - Limit results
   * @param {string} options.sort - Sort field (e.g., '-createdAt')
   */
  const getArtworks = async (options = {}) => {
    const params = {
      depth: 2, // Include related series, mediums
      sort: '-year', // Default: newest first
      ...options,
    };

    // Build where clause
    const where = {};

    if (options.seriesId) {
      where.series = { equals: options.seriesId };
    }

    if (options.status) {
      where.status = { equals: options.status };
    }

    if (Object.keys(where).length > 0) {
      params.where = where;
    }

    return fetchAll(params);
  };

  /**
   * Fetch single artwork by ID
   * @param {string} id - Artwork ID
   */
  const getArtworkById = async (id) => {
    return fetchById(id, { depth: 2 });
  };

  /**
   * Fetch single artwork by slug
   * @param {string} slug - Artwork slug
   */
  const getArtworkBySlug = async (slug) => {
    const result = await fetchBySlug(slug, { depth: 2 });
    return result?.docs?.[0] || null;
  };

  /**
   * Fetch featured artworks
   * @param {number} limit - Number of artworks to fetch
   */
  const getFeaturedArtworks = async (limit = 6) => {
    return fetchAll({
      where: {
        featured: { equals: true },
      },
      limit,
      depth: 2,
      sort: '-year',
    });
  };

  /**
   * Fetch artworks by series
   * @param {string} seriesId - Series ID
   */
  const getArtworksBySeries = async (seriesId) => {
    return getArtworks({ seriesId, limit: 100 });
  };

  return {
    artworks,
    loading,
    error,
    getArtworks,
    getArtworkById,
    getArtworkBySlug,
    getFeaturedArtworks,
    getArtworksBySeries,
  };
}

export default useArtworks;
