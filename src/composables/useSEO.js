/**
 * Composable for managing SEO meta tags
 * Provides dynamic title, description, og:image, and other meta tags
 */

import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Update document title
 * @param {string} title - Page title
 * @param {string} siteName - Site name to append
 */
function updateTitle(title, siteName = '') {
  if (title && siteName) {
    document.title = `${title} | ${siteName}`;
  } else if (title) {
    document.title = title;
  } else if (siteName) {
    document.title = siteName;
  }
}

/**
 * Update or create meta tag
 * @param {string} name - Meta name or property
 * @param {string} content - Meta content
 * @param {boolean} isProperty - Use property attribute instead of name
 */
function updateMetaTag(name, content, isProperty = false) {
  if (!content) return;

  const attribute = isProperty ? 'property' : 'name';
  const selector = `meta[${attribute}="${name}"]`;

  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

/**
 * Remove meta tag
 * @param {string} name - Meta name or property
 * @param {boolean} isProperty - Use property attribute instead of name
 */
function removeMetaTag(name, isProperty = false) {
  const attribute = isProperty ? 'property' : 'name';
  const selector = `meta[${attribute}="${name}"]`;
  const tag = document.querySelector(selector);

  if (tag) {
    tag.remove();
  }
}

/**
 * Update canonical link
 * @param {string} url - Canonical URL
 */
function updateCanonical(url) {
  if (!url) return;

  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
}

export function useSEO(options = {}) {
  const route = useRoute();

  const defaultOptions = {
    siteName: import.meta.env.VITE_SITE_NAME || 'Artist Portfolio',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://example.com',
    defaultTitle: 'Home',
    defaultDescription: 'Explore contemporary art and exhibitions',
    defaultImage: '/images/og-default.jpg',
    twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || '',
  };

  const config = { ...defaultOptions, ...options };

  /**
   * Set SEO meta tags
   * @param {object} seo - SEO configuration
   * @param {string} seo.title - Page title
   * @param {string} seo.description - Page description
   * @param {string} seo.image - OG image URL
   * @param {string} seo.type - OG type (website, article, etc.)
   * @param {string} seo.url - Canonical URL
   * @param {object} seo.article - Article-specific meta (for og:article)
   * @param {boolean} seo.noindex - Add noindex meta tag
   */
  const setSEO = (seo = {}) => {
    const title = seo.title || config.defaultTitle;
    const description = seo.description || config.defaultDescription;
    const image = seo.image || config.defaultImage;
    const type = seo.type || 'website';
    const url = seo.url || `${config.siteUrl}${route.path}`;

    // Ensure image is absolute URL
    const imageUrl = image.startsWith('http') ? image : `${config.siteUrl}${image}`;

    // Update title
    updateTitle(title, config.siteName);

    // Update basic meta tags
    updateMetaTag('description', description);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:site_name', config.siteName, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);

    if (config.twitterHandle) {
      updateMetaTag('twitter:site', config.twitterHandle);
      updateMetaTag('twitter:creator', config.twitterHandle);
    }

    // Article-specific meta
    if (type === 'article' && seo.article) {
      if (seo.article.publishedTime) {
        updateMetaTag('article:published_time', seo.article.publishedTime, true);
      }
      if (seo.article.modifiedTime) {
        updateMetaTag('article:modified_time', seo.article.modifiedTime, true);
      }
      if (seo.article.author) {
        updateMetaTag('article:author', seo.article.author, true);
      }
      if (seo.article.section) {
        updateMetaTag('article:section', seo.article.section, true);
      }
      if (seo.article.tags && Array.isArray(seo.article.tags)) {
        // Remove existing article:tag metas
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());

        // Add new tags
        seo.article.tags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    // Update canonical URL
    updateCanonical(url);

    // Handle noindex
    if (seo.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      removeMetaTag('robots');
    }
  };

  /**
   * Set SEO from Sanity CMS page data
   * @param {object} page - Page data from Sanity
   */
  const setSEOFromPage = (page) => {
    if (!page) return;

    const seo = {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      image: page.meta?.image?.url || page.heroImage?.url,
      noindex: page.meta?.noindex,
    };

    setSEO(seo);
  };

  /**
   * Set SEO for artwork detail page
   * @param {object} artwork - Artwork data
   */
  const setSEOForArtwork = (artwork) => {
    if (!artwork) return;

    const seo = {
      title: artwork.title,
      description: artwork.description || `${artwork.title} by ${config.siteName}`,
      image: artwork.images?.[0]?.url || artwork.mainImage?.url,
      type: 'article',
      article: {
        publishedTime: artwork.createdAt,
        modifiedTime: artwork.updatedAt,
        section: 'Artwork',
        tags: [
          artwork.medium?.name,
          artwork.series?.title,
          artwork.year?.toString(),
        ].filter(Boolean),
      },
    };

    setSEO(seo);
  };

  /**
   * Set SEO for series page
   * @param {object} series - Series data
   */
  const setSEOForSeries = (series) => {
    if (!series) return;

    const seo = {
      title: series.title,
      description: series.description || `${series.title} series by ${config.siteName}`,
      image: series.coverImage?.url || series.artworks?.[0]?.images?.[0]?.url,
      type: 'article',
      article: {
        publishedTime: series.createdAt,
        section: 'Series',
      },
    };

    setSEO(seo);
  };

  /**
   * Reset SEO to defaults
   */
  const resetSEO = () => {
    setSEO({});
  };

  // Auto-reset SEO on route change
  onMounted(() => {
    watch(
      () => route.path,
      () => {
        // Reset to defaults when route changes
        // Component will set specific SEO after data loads
        resetSEO();
      }
    );
  });

  return {
    setSEO,
    setSEOFromPage,
    setSEOForArtwork,
    setSEOForSeries,
    resetSEO,
  };
}

export default useSEO;
