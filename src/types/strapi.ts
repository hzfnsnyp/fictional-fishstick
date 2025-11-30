/**
 * Strapi API Response Types
 */

// Base Strapi response structure
export interface StrapiResponse<T> {
  data: T
  meta?: StrapiMeta
}

export interface StrapiCollectionResponse<T> {
  data: T[]
  meta: StrapiMeta
}

export interface StrapiMeta {
  pagination?: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

// Strapi data structure
export interface StrapiData<T> {
  id: number
  attributes: T
}

// Media/Upload type
export interface StrapiMedia {
  id: number
  attributes: {
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: {
      thumbnail?: StrapiImageFormat
      small?: StrapiImageFormat
      medium?: StrapiImageFormat
      large?: StrapiImageFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    createdAt: string
    updatedAt: string
  }
}

export interface StrapiImageFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path: string | null
  url: string
}

// SEO Component
export interface StrapiSEO {
  metaTitle?: string
  metaDescription?: string
  metaImage?: {
    data: StrapiMedia | null
  }
  keywords?: string
  canonicalURL?: string
  noindex?: boolean
}

// Artwork
export interface StrapiArtwork {
  title: string
  slug: string
  description?: string
  year: number
  medium?: string
  dimensions?: string
  width?: number
  height?: number
  depth?: number
  images: {
    data: StrapiMedia[]
  }
  mainImage?: {
    data: StrapiMedia | null
  }
  series?: {
    data: StrapiData<StrapiSeries> | null
  }
  price?: number
  available: boolean
  featured: boolean
  order: number
  seo?: StrapiSEO
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Series
export interface StrapiSeries {
  title: string
  slug: string
  description: string
  startYear?: number
  endYear?: number
  ongoing: boolean
  coverImage?: {
    data: StrapiMedia | null
  }
  artworks?: {
    data: StrapiData<StrapiArtwork>[]
  }
  metadata?: any
  catalogPdf?: {
    data: StrapiMedia | null
  }
  featured: boolean
  order: number
  seo?: StrapiSEO
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Exhibition
export interface StrapiExhibition {
  title: string
  slug: string
  year: number
  venue: string
  location: string
  type: 'solo' | 'group' | 'other'
  description?: string
  startDate?: string
  endDate?: string
  url?: string
  images?: {
    data: StrapiMedia[]
  }
  artworks?: {
    data: StrapiData<StrapiArtwork>[]
  }
  featured: boolean
  order: number
  seo?: StrapiSEO
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Page Dynamic Zones
export interface StrapiHeroComposer {
  __component: 'sections.hero-composer'
  title: string
  image: {
    data: StrapiMedia
  }
  imageAlt?: string
  artworkTitle?: string
  year?: string
  medium?: string
  dimensions?: string
}

export interface StrapiEssay {
  __component: 'sections.essay'
  headingLine1?: string
  headingLine2?: string
  headingLine3?: string
  paragraphs: string[]
  signature?: {
    data: StrapiMedia | null
  }
  signatureAlt?: string
}

export interface StrapiPracticeHighlights {
  __component: 'sections.practice-highlights'
  image: {
    data: StrapiMedia
  }
  imageAlt?: string
  stats: Array<{
    value: string
    description: string
    title: string
  }>
}

export interface StrapiSeriesOverview {
  __component: 'sections.series-overview'
  heading: string
  series: {
    data: StrapiData<StrapiSeries>[]
  }
  limit?: number
}

export interface StrapiFeaturedExhibition {
  __component: 'sections.featured-exhibition'
  exhibition: {
    data: StrapiData<StrapiExhibition>
  }
  customTitle?: string
  customDescription?: string
}

export interface StrapiArtworkCarousel {
  __component: 'sections.artwork-carousel'
  artworks: {
    data: StrapiData<StrapiArtwork>[]
  }
  limit?: number
}

export interface StrapiTechniquesOverview {
  __component: 'sections.techniques-overview'
  statement?: string
  features?: Array<{
    title: string
    text: string
  }>
}

export interface StrapiPracticePhases {
  __component: 'sections.practice-phases'
  quote?: string
  quoteAuthor?: string
  timeline?: Array<{
    title: string
    period?: string
    description?: string
  }>
}

export interface StrapiMediaArchive {
  __component: 'sections.media-archive'
  title?: string
  category?: 'magazine' | 'press' | 'radio'
  items?: Array<{
    label: string
    title: string
    meta?: string
    href?: string
  }>
}

export type StrapiPageContent =
  | StrapiHeroComposer
  | StrapiEssay
  | StrapiPracticeHighlights
  | StrapiSeriesOverview
  | StrapiFeaturedExhibition
  | StrapiArtworkCarousel
  | StrapiTechniquesOverview
  | StrapiPracticePhases
  | StrapiMediaArchive

// Page
export interface StrapiPage {
  title: string
  slug: string
  content?: StrapiPageContent[]
  template: 'default' | 'home' | 'about' | 'contact'
  heroImage?: {
    data: StrapiMedia | null
  }
  seo?: StrapiSEO
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// Global Settings
export interface StrapiGlobal {
  siteName: string
  siteUrl: string
  maintenanceMode: boolean
  maintenanceMessage?: string
  contactEmail?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
  defaultSeo?: StrapiSEO
  logo?: {
    data: StrapiMedia | null
  }
  favicon?: {
    data: StrapiMedia | null
  }
}

// Global Status (custom endpoint)
export interface GlobalStatus {
  maintenanceMode: boolean
  maintenanceMessage?: string
  siteName: string
  contactEmail?: string
}
