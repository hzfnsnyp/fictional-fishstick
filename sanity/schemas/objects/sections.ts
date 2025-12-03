import {defineArrayMember, defineField, defineType} from 'sanity'

const heroComposer = defineType({
  name: 'section.heroComposer',
  title: 'Hero composer',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required()}),
    defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}, validation: Rule => Rule.required()}),
    defineField({name: 'imageAlt', type: 'string', title: 'Image alt'}),
    defineField({name: 'artworkTitle', type: 'string', title: 'Artwork title'}),
    defineField({name: 'year', type: 'string', title: 'Year'}),
    defineField({name: 'medium', type: 'string', title: 'Medium'}),
    defineField({name: 'dimensions', type: 'string', title: 'Dimensions'}),
  ],
})

const essay = defineType({
  name: 'section.essay',
  title: 'Essay',
  type: 'object',
  fields: [
    defineField({name: 'headingLine1', type: 'string', title: 'Heading line 1'}),
    defineField({name: 'headingLine2', type: 'string', title: 'Heading line 2'}),
    defineField({name: 'headingLine3', type: 'string', title: 'Heading line 3'}),
    defineField({name: 'paragraphs', type: 'array', title: 'Paragraphs', of: [{type: 'text'}]}),
    defineField({name: 'signature', type: 'image', title: 'Signature', options: {hotspot: true}}),
    defineField({name: 'signatureAlt', type: 'string', title: 'Signature alt'}),
  ],
})

const practiceHighlights = defineType({
  name: 'section.practiceHighlights',
  title: 'Practice highlights',
  type: 'object',
  fields: [
    defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', type: 'string', title: 'Image alt'}),
    defineField({name: 'stats', type: 'array', title: 'Stats', of: [{type: 'stat'}]}),
  ],
})

const seriesOverview = defineType({
  name: 'section.seriesOverview',
  title: 'Series overview',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'series',
      type: 'array',
      title: 'Series',
      of: [defineArrayMember({type: 'reference', to: [{type: 'series'}]})],
    }),
    defineField({name: 'limit', type: 'number', title: 'Limit'}),
  ],
})

const featuredExhibition = defineType({
  name: 'section.featuredExhibition',
  title: 'Featured exhibition',
  type: 'object',
  fields: [
    defineField({name: 'exhibition', type: 'reference', to: [{type: 'exhibition'}], validation: Rule => Rule.required()}),
    defineField({name: 'customTitle', type: 'string', title: 'Custom title'}),
    defineField({name: 'customDescription', type: 'text', title: 'Custom description'}),
  ],
})

const artworkCarousel = defineType({
  name: 'section.artworkCarousel',
  title: 'Artwork carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'artworks',
      type: 'array',
      title: 'Artworks',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artwork'}]})],
    }),
    defineField({name: 'limit', type: 'number', title: 'Limit'}),
  ],
})

const techniquesOverview = defineType({
  name: 'section.techniquesOverview',
  title: 'Techniques overview',
  type: 'object',
  fields: [
    defineField({name: 'statement', type: 'text', title: 'Statement'}),
    defineField({name: 'features', type: 'array', title: 'Features', of: [{type: 'feature'}]}),
  ],
})

const practicePhases = defineType({
  name: 'section.practicePhases',
  title: 'Practice phases',
  type: 'object',
  fields: [
    defineField({name: 'quote', type: 'text', title: 'Quote'}),
    defineField({name: 'quoteAuthor', type: 'string', title: 'Quote author'}),
    defineField({name: 'timeline', type: 'array', title: 'Timeline', of: [{type: 'timelineItem'}]}),
  ],
})

const mediaArchive = defineType({
  name: 'section.mediaArchive',
  title: 'Media archive',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title'}),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {list: ['magazine', 'press', 'radio']},
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [{type: 'mediaArchiveItem'}],
    }),
  ],
})

export default [
  heroComposer,
  essay,
  practiceHighlights,
  seriesOverview,
  featuredExhibition,
  artworkCarousel,
  techniquesOverview,
  practicePhases,
  mediaArchive,
]
