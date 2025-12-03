import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Artworks',
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
    defineField({name: 'year', type: 'number', title: 'Year', validation: Rule => Rule.min(1000).max(3000)}),
    defineField({name: 'medium', type: 'string', title: 'Medium'}),
    defineField({name: 'dimensions', type: 'string', title: 'Dimensions'}),
    defineField({name: 'width', type: 'number', title: 'Width', validation: Rule => Rule.min(0)}),
    defineField({name: 'height', type: 'number', title: 'Height', validation: Rule => Rule.min(0)}),
    defineField({name: 'depth', type: 'number', title: 'Depth', validation: Rule => Rule.min(0)}),
    defineField({name: 'mainImage', type: 'image', title: 'Main image', options: {hotspot: true}}),
    defineField({name: 'images', type: 'array', title: 'Images', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'series', type: 'reference', to: [{type: 'series'}], title: 'Series'}),
    defineField({name: 'price', type: 'number', title: 'Price', validation: Rule => Rule.min(0)}),
    defineField({name: 'available', type: 'boolean', title: 'Available', initialValue: true}),
    defineField({name: 'featured', type: 'boolean', title: 'Featured'}),
    defineField({name: 'order', type: 'number', title: 'Order', validation: Rule => Rule.min(0)}),
    defineField({name: 'seo', type: 'seo', title: 'SEO'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'mainImage',
    },
  },
})
