/**
 * Sanity API Service
 */

import groq from 'groq'
import {sanityClient} from './sanityClient'

const artworkFields = groq`{
  _id,
  title,
  "slug": coalesce(id.current, slug.current),
  image,
  imageWidth,
  imageHeight,
  alt,
  thumbnail,
  year,
  "medium": medium->title,
  "mediumId": medium->_id,
  width,
  height,
  "dimensions": width && height ? width + " × " + height + " cm" : null,
  available,
  size,
  "series": series->{_id, title, "slug": coalesce(id.current, slug.current)}
}`

const seriesFields = groq`{
  _id,
  title,
  "slug": slug.current,
  description,
  startYear,
  endYear,
  ongoing,
  featured,
  order,
  "coverImage": coverImage,
  "catalogPdf": {
    "url": catalogPdf.asset->url,
    label
  },
  "metadata": metadata[]{label, value},
  "artworks": artworks[]->{...${artworkFields}},
  seo
}`

const exhibitionFields = groq`{
  _id,
  title,
  "slug": slug.current,
  year,
  venue,
  location,
  type,
  description,
  startDate,
  endDate,
  url,
  featured,
  order,
  "images": images[],
  "artworks": artworks[]->{...${artworkFields}},
  seo
}`

/**
 * Global Settings & Status
 */
export async function getGlobalStatus() {
  return sanityClient.fetch(
    groq`*[_type == "global"][0]{maintenanceMode, maintenanceMessage, siteName, contactEmail}`
  )
}

export async function getGlobalSettings() {
  return sanityClient.fetch(
    groq`*[_type == "global"][0]{
      siteName,
      siteUrl,
      maintenanceMode,
      maintenanceMessage,
      contactEmail,
      socialLinks,
      navigationLinks,
      footerLinks,
      defaultSeo
    }`
  )
}

/**
 * Artworks
 */
export async function getArtworks() {
  return sanityClient.fetch(groq`*[_type == "artwork"]|order(year desc, order asc){...${artworkFields}}`)
}

export async function getArtwork(id) {
  return sanityClient.fetch(
    groq`*[_type == "artwork" && _id == $id][0]{...${artworkFields}}`,
    {id}
  )
}

export async function getArtworkBySlug(slug) {
  return sanityClient.fetch(
    groq`*[_type == "artwork" && slug.current == $slug][0]{...${artworkFields}}`,
    {slug}
  )
}

export async function getFeaturedArtworks(limit = 6) {
  return sanityClient.fetch(
    groq`*[_type == "artwork" && featured == true]|order(order asc)[0...$limit]{...${artworkFields}}`,
    {limit}
  )
}

/**
 * Series
 */
export async function getSeries() {
  return sanityClient.fetch(
    groq`*[_type == "series"]|order(startYear desc, order asc){...${seriesFields}}`
  )
}

export async function getSeriesById(id) {
  return sanityClient.fetch(
    groq`*[_type == "series" && _id == $id][0]{...${seriesFields}}`,
    {id}
  )
}

export async function getSeriesBySlug(slug) {
  return sanityClient.fetch(
    groq`*[_type == "series" && slug.current == $slug][0]{...${seriesFields}}`,
    {slug}
  )
}

export async function getFeaturedSeries(limit = 3) {
  return sanityClient.fetch(
    groq`*[_type == "series" && featured == true]|order(order asc)[0...$limit]{...${seriesFields}}`,
    {limit}
  )
}

/**
 * Exhibitions
 */
export async function getExhibitions() {
  return sanityClient.fetch(
    groq`*[_type == "exhibition"]|order(year desc, order asc){...${exhibitionFields}}`
  )
}

export async function getExhibition(id) {
  return sanityClient.fetch(
    groq`*[_type == "exhibition" && _id == $id][0]{...${exhibitionFields}}`,
    {id}
  )
}

export async function getExhibitionBySlug(slug) {
  return sanityClient.fetch(
    groq`*[_type == "exhibition" && slug.current == $slug][0]{...${exhibitionFields}}`,
    {slug}
  )
}

export async function getFeaturedExhibition() {
  return sanityClient.fetch(
    groq`*[_type == "exhibition" && featured == true]|order(year desc)[0]{...${exhibitionFields}}`
  )
}

/**
 * Pages
 */
export async function getPages() {
  return sanityClient.fetch(groq`*[_type == "page"]{_id, title, "slug": slug.current, template}`)
}

export async function getPage(id) {
  return sanityClient.fetch(
    groq`*[_type == "page" && _id == $id][0]{
      title,
      "slug": slug.current,
      template,
      heroImage,
      seo,
      content[]{
        _type,
        _type == "section.heroComposer" => {
          _type,
          title,
          artworkTitle,
          year,
          medium,
          dimensions,
          image
        },
        _type == "section.essay" => {
          _type,
          headingLine1,
          headingLine2,
          headingLine3,
          paragraphs,
          signature,
          signatureAlt
        },
        _type == "section.practiceHighlights" => {
          _type,
          image,
          imageAlt,
          stats
        },
        _type == "section.seriesOverview" => {
          _type,
          heading,
          "series": series[]->{ ...${seriesFields} },
          limit
        },
        _type == "section.featuredExhibition" => {
          _type,
          "exhibition": exhibition->{ ...${exhibitionFields} },
          customTitle,
          customDescription
        },
        _type == "section.artworkCarousel" => {
          _type,
          "artworks": artworks[]->{ ...${artworkFields} },
          limit
        },
        _type == "section.techniquesOverview" => {
          _type,
          statement,
          features
        },
        _type == "section.practicePhases" => {
          _type,
          quote,
          quoteAuthor,
          timeline
        },
        _type == "section.mediaArchive" => {
          _type,
          title,
          category,
          "items": items[]->{label, title, meta, href, year}
        }
      }
    }`,
    {id}
  )
}

export async function getPageBySlug(slug) {
  return sanityClient.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      template,
      heroImage,
      seo,
      content[]{
        _type,
        _type == "section.heroComposer" => {
          _type,
          title,
          artworkTitle,
          year,
          medium,
          dimensions,
          image
        },
        _type == "section.essay" => {
          _type,
          headingLine1,
          headingLine2,
          headingLine3,
          paragraphs,
          signature,
          signatureAlt
        },
        _type == "section.practiceHighlights" => {
          _type,
          image,
          imageAlt,
          stats
        },
        _type == "section.seriesOverview" => {
          _type,
          heading,
          "series": series[]->{ ...${seriesFields} },
          limit
        },
        _type == "section.featuredExhibition" => {
          _type,
          "exhibition": exhibition->{ ...${exhibitionFields} },
          customTitle,
          customDescription
        },
        _type == "section.artworkCarousel" => {
          _type,
          "artworks": artworks[]->{ ...${artworkFields} },
          limit
        },
        _type == "section.techniquesOverview" => {
          _type,
          statement,
          features
        },
        _type == "section.practicePhases" => {
          _type,
          quote,
          quoteAuthor,
          timeline
        },
        _type == "section.mediaArchive" => {
          _type,
          title,
          category,
          "items": items[]->{label, title, meta, href, year}
        }
      }
    }`,
    {slug}
  )
}

/**
 * Search (basic contains on title/description)
 */
export async function searchContent(query, types = ['artworks', 'series', 'exhibitions']) {
  const params = {query: query || ''}
  const result = {artworks: [], series: [], exhibitions: []}

  if (types.includes('artworks')) {
    result.artworks = await sanityClient.fetch(
      groq`*[_type == "artwork" && (title match $query || description match $query)]{...${artworkFields}}`,
      params
    )
  }
  if (types.includes('series')) {
    result.series = await sanityClient.fetch(
      groq`*[_type == "series" && (title match $query || description match $query)]{...${seriesFields}}`,
      params
    )
  }
  if (types.includes('exhibitions')) {
    result.exhibitions = await sanityClient.fetch(
      groq`*[_type == "exhibition" && (title match $query || description match $query)]{...${exhibitionFields}}`,
      params
    )
  }

  return result
}
