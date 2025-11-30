/**
 * CMS Data helpers (Sanity)
 */

import {computed} from 'vue'
import {imageVariants} from '@/services/imageUrl'

const formatDimensions = (width, height, depth) => {
  const w = Number(width)
  const h = Number(height)
  const d = Number(depth)
  if (!w || !h) return ''
  const base = `${w} × ${h}`
  return d ? `${base} × ${d} cm` : `${base} cm`
}

const mapImages = images =>
  (images?.data || images || []).map(img => {
    const node = img.attributes || img
    const variants = imageVariants(node)
    return {
      src: variants.large || node.url || '',
      thumb: variants.thumb || node.url,
      medium: variants.medium || node.url,
      alt: node.alt || node.alternativeText || '',
      caption: node.caption || '',
      width: node.width,
      height: node.height,
    }
  })

export function useArtworkData(artwork) {
  return computed(() => {
    if (!artwork) return null
    const a = artwork.attributes || artwork

    return {
      id: artwork._id || a._id || artwork.id || a.id,
      title: a.title,
      slug: a.slug,
      year: a.year,
      medium: a.medium,
      dimensions: a.dimensions || formatDimensions(a.width, a.height, a.depth),
      width: a.width,
      height: a.height,
      depth: a.depth,
      description: a.description,
      price: a.price,
      available: a.available,
      image: a.image,
      imageWidth: a.imageWidth,
      imageHeight: a.imageHeight,
      images: a.images ? mapImages(a.images) : [],
      series: a.series
        ? {
            id: a.series._id || a.series.id,
            title: a.series.title,
            slug: a.series.slug,
          }
        : null,
      seo: a.seo,
    }
  })
}

export function useSeriesData(series) {
  return computed(() => {
    if (!series) return null
    const s = series.attributes || series

    return {
      id: series._id || s._id || series.id || s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      startYear: s.startYear,
      endYear: s.endYear,
      ongoing: s.ongoing,
      coverImage: s.coverImage?.url || s.coverImage || '',
      metadata: s.metadata || [],
      catalogPdf: s.catalogPdf
        ? {
            url: s.catalogPdf.url,
            name: s.catalogPdf.label || s.catalogPdf.name,
          }
        : null,
      artworks: (s.artworks?.data || s.artworks || []).map(artwork => useArtworkData(artwork).value),
      seo: s.seo,
    }
  })
}

export function useExhibitionData(exhibition) {
  return computed(() => {
    if (!exhibition) return null
    const e = exhibition.attributes || exhibition
    const images = mapImages(e.images)

    return {
      id: exhibition._id || e._id || exhibition.id || e.id,
      title: e.title,
      slug: e.slug,
      year: e.year,
      venue: e.venue,
      location: e.location,
      type: e.type,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      url: e.url,
      images,
      image: images[0]?.src || null,
      artworks: (e.artworks?.data || e.artworks || []).map(artwork => useArtworkData(artwork).value),
      seo: e.seo,
    }
  })
}

export function usePageContent(page) {
  return computed(() => {
    const content = page?.content
    if (!content) return []

    return content.map(section => {
      const type = section._type || section.__component

      if (type === 'section.heroComposer' || type === 'sections.hero-composer') {
        const img = section.image
        const variants = imageVariants(img)
        return {
          type: 'hero-composer',
          title: section.title,
          imageSrc: variants.large || section.image?.url || section.image || '',
          imageAlt: section.image?.alt || section.imageAlt || '',
          artworkTitle: section.artworkTitle,
          year: section.year,
          medium: section.medium,
          dimensions: section.dimensions,
        }
      }

      if (type === 'section.essay' || type === 'sections.essay') {
        const sig = section.signature
        const sigVariants = imageVariants(sig)
        return {
          type: 'essay',
          headingLine1: section.headingLine1,
          headingLine2: section.headingLine2,
          headingLine3: section.headingLine3,
          paragraphs: section.paragraphs || [],
          signatureSrc: sigVariants.thumb || section.signature?.url || section.signature || '',
          signatureAlt: section.signature?.alt || section.signatureAlt || 'Signature',
        }
      }

      if (type === 'section.practiceHighlights' || type === 'sections.practice-highlights') {
        const img = section.image
        const variants = imageVariants(img)
        return {
          type: 'practice-highlights',
          imageSrc: variants.medium || section.image?.url || section.image || '',
          imageAlt: section.image?.alt || section.imageAlt || '',
          stats: section.stats || [],
        }
      }

      if (type === 'section.seriesOverview' || type === 'sections.series-overview') {
        return {
          type: 'series-overview',
          heading: section.heading || 'Series overview',
          series: (section.series?.data || section.series || []).map(s => useSeriesData(s).value),
          limit: section.limit,
        }
      }

      if (type === 'section.featuredExhibition' || type === 'sections.featured-exhibition') {
        return {
          type: 'featured-exhibition',
          exhibition: section.exhibition
            ? useExhibitionData(section.exhibition).value
            : null,
          customTitle: section.customTitle,
          customDescription: section.customDescription,
        }
      }

      if (type === 'section.artworkCarousel' || type === 'sections.artwork-carousel') {
        return {
          type: 'artwork-carousel',
          artworks: (section.artworks?.data || section.artworks || []).map(a => useArtworkData(a).value),
          limit: section.limit,
        }
      }

      if (type === 'section.techniquesOverview' || type === 'sections.techniques-overview') {
        return {
          type: 'techniques-overview',
          statement: section.statement || '',
          features: section.features || [],
        }
      }

      if (type === 'section.practicePhases' || type === 'sections.practice-phases') {
        return {
          type: 'practice-phases',
          quote: section.quote || '',
          quoteAuthor: section.quoteAuthor || '',
          timeline: section.timeline || [],
        }
      }

      if (type === 'section.mediaArchive' || type === 'sections.media-archive') {
        return {
          type: 'media-archive',
          title: section.title || '',
          category: section.category || 'press',
          items: section.items || [],
        }
      }

      return section
    })
  })
}
