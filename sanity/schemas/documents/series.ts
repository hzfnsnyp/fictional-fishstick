import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({name: 'description', type: 'text', title: 'Description'}),
    defineField({name: 'startYear', type: 'number', title: 'Start year', validation: Rule => Rule.min(1000).max(3000)}),
    defineField({name: 'endYear', type: 'number', title: 'End year', validation: Rule => Rule.min(1000).max(3000)}),
    defineField({name: 'ongoing', type: 'boolean', title: 'Ongoing'}),
    defineField({name: 'coverImage', type: 'image', title: 'Cover image', options: {hotspot: true}}),
    defineField({
      name: 'artworks',
      type: 'array',
      title: 'Artworks',
      of: [{type: 'reference', to: [{type: 'artwork'}]}],
    }),
    defineField({name: 'metadata', type: 'array', title: 'Metadata', of: [{type: 'metaKV'}]}),
    defineField({name: 'catalogPdf', type: 'file', title: 'Catalog PDF'}),
    defineField({name: 'featured', type: 'boolean', title: 'Featured'}),
    defineField({name: 'order', type: 'number', title: 'Order', validation: Rule => Rule.min(0)}),
    defineField({name: 'seo', type: 'seo', title: 'SEO'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'startYear',
      media: 'coverImage',
    },
  },
})
