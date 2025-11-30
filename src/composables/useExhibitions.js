/**
 * Composable for managing Exhibitions from Payload CMS
 */

import { usePayloadAPI } from './usePayloadAPI';

export function useExhibitions() {
  const {
    data: exhibitions,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchBySlug,
  } = usePayloadAPI('exhibitions');

  /**
   * Fetch all exhibitions with optional filters
   * @param {object} options - Filter options
   * @param {string} options.type - Filter by exhibition type
   * @param {boolean} options.upcoming - Filter upcoming exhibitions
   * @param {number} options.limit - Limit results
   */
  const getExhibitions = async (options = {}) => {
    const params = {
      depth: 2,
      sort: '-startDate', // Default: newest first
      ...options,
    };

    // Build where clause
    const where = {};

    if (options.type) {
      where.type = { equals: options.type };
    }

    if (options.upcoming) {
      where.startDate = { greater_than: new Date().toISOString() };
    }

    if (Object.keys(where).length > 0) {
      params.where = where;
    }

    return fetchAll(params);
  };

  /**
   * Fetch single exhibition by ID
   * @param {string} id - Exhibition ID
   */
  const getExhibitionById = async (id) => {
    return fetchById(id, { depth: 2 });
  };

  /**
   * Fetch single exhibition by slug
   * @param {string} slug - Exhibition slug
   */
  const getExhibitionBySlug = async (slug) => {
    const result = await fetchBySlug(slug, { depth: 2 });
    return result?.docs?.[0] || null;
  };

  /**
   * Fetch upcoming exhibitions
   * @param {number} limit - Number of exhibitions
   */
  const getUpcomingExhibitions = async (limit = 5) => {
    return getExhibitions({
      upcoming: true,
      limit,
    });
  };

  /**
   * Fetch past exhibitions
   * @param {number} limit - Number of exhibitions
   */
  const getPastExhibitions = async (limit = 20) => {
    return fetchAll({
      where: {
        startDate: { less_than: new Date().toISOString() },
      },
      limit,
      depth: 2,
      sort: '-startDate',
    });
  };

  return {
    exhibitions,
    loading,
    error,
    getExhibitions,
    getExhibitionById,
    getExhibitionBySlug,
    getUpcomingExhibitions,
    getPastExhibitions,
  };
}

export default useExhibitions;
