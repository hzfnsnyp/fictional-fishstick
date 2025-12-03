import imageUrlBuilder from '@sanity/image-url'
import {sanityClient} from './sanityClient'

const builder = imageUrlBuilder(sanityClient)

export const urlFor = source => builder.image(source)

export const imageVariants = source => {
  if (!source) return {}

  // Plain URL or object with url — just echo it for all sizes
  const rawUrl = typeof source === 'string' ? source : source.url
  if (rawUrl && !source.asset?._ref && !source._ref) {
    return {
      thumb: rawUrl,
      medium: rawUrl,
      large: rawUrl,
      raw: rawUrl,
    }
  }

  // Sanity image object / ref
  const base = builder.image(source).auto('format')
  return {
    thumb: base.width(400).height(400).fit('max').url(),
    medium: base.width(900).fit('max').url(),
    large: base.width(2000).fit('max').url(),
    raw: base.url(),
  }
}
