import artwork from './documents/artwork'
import series from './documents/series'
import exhibition from './documents/exhibition'
import page from './documents/page'
import globalSettings from './singletons/global'
import mediaEntry from './documents/mediaEntry'

import seo from './objects/seo'
import socialLinks from './objects/socialLinks'
import navLink from './objects/navLink'
import metaKV from './objects/metaKV'
import stat from './objects/stat'
import feature from './objects/feature'
import timelineItem from './objects/timelineItem'
import mediaArchiveItem from './objects/mediaArchiveItem'

import sections from './objects/sections'

export const schemaTypes = [
  // documents
  artwork,
  series,
  exhibition,
  page,
  mediaEntry,
  globalSettings,
  // objects
  seo,
  socialLinks,
  navLink,
  metaKV,
  stat,
  feature,
  timelineItem,
  mediaArchiveItem,
  // sections
  ...sections,
]

export default schemaTypes
