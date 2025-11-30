/**
 * CMS image helpers (adapted for Sanity projections)
 */

export function getStrapiImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') {
    if (image.url) return image.url
    if (image.asset?.url) return image.asset.url
    if (image.data?.attributes?.url) return image.data.attributes.url
  }
  return ''
}

export function getStrapiImageFormat(image) {
  return getStrapiImageUrl(image)
}
