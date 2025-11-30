/**
 * Composable for managing Series from Payload CMS
 */

import { usePayloadAPI } from './usePayloadAPI';

export function useSeries() {
  const {
    data: series,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchBySlug,
  } = usePayloadAPI('series');

  /**
   * Fetch all series with optional filters
   * @param {object} options - Filter options
   * @param {boolean} options.featured - Filter featured series
   * @param {number} options.limit - Limit results
   * @param {string} options.sort - Sort field
   */
  const getSeries = async (options = {}) => {
    const params = {
      depth: 1,
      sort: '-startYear', // Default: newest first
      ...options,
    };

    // Build where clause
    const where = {};

    if (options.featured !== undefined) {
      where.featured = { equals: options.featured };
    }

    if (Object.keys(where).length > 0) {
      params.where = where;
    }

    return fetchAll(params);
  };

  /**
   * Fetch single series by ID
   * @param {string} id - Series ID
   */
  const getSeriesById = async (id) => {
    return fetchById(id, { depth: 2 });
  };

  /**
   * Fetch single series by slug
   * @param {string} slug - Series slug
   */
  const getSeriesBySlug = async (slug) => {
    const result = await fetchBySlug(slug, { depth: 2 });
    return result?.docs?.[0] || null;
  };

  /**
   * Fetch featured series
   * @param {number} limit - Number of series to fetch
   */
  const getFeaturedSeries = async (limit = 6) => {
    return getSeries({
      featured: true,
      limit,
    });
  };

  return {
    series,
    loading,
    error,
    getSeries,
    getSeriesById,
    getSeriesBySlug,
    getFeaturedSeries,
  };
}

export default useSeries;
