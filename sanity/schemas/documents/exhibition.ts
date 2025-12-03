import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Exhibitions',
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
    defineField({name: 'year', type: 'number', title: 'Year', validation: Rule => Rule.min(1000).max(3000)}),
    defineField({name: 'venue', type: 'string', title: 'Venue'}),
    defineField({name: 'location', type: 'string', title: 'Location'}),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {list: ['solo', 'group', 'other']},
    }),
    defineField({name: 'description', type: 'text', title: 'Description'}),
    defineField({name: 'startDate', type: 'date', title: 'Start date'}),
    defineField({name: 'endDate', type: 'date', title: 'End date'}),
    defineField({name: 'url', type: 'url', title: 'External URL'}),
    defineField({name: 'images', type: 'array', title: 'Images', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({
      name: 'artworks',
      type: 'array',
      title: 'Artworks',
      of: [{type: 'reference', to: [{type: 'artwork'}]}],
    }),
    defineField({name: 'featured', type: 'boolean', title: 'Featured'}),
    defineField({name: 'order', type: 'number', title: 'Order', validation: Rule => Rule.min(0)}),
    defineField({name: 'seo', type: 'seo', title: 'SEO'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'images.0',
    },
  },
})
