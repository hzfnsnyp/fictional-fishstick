import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
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
    defineField({
      name: 'template',
      type: 'string',
      title: 'Template',
      options: {list: ['default', 'home', 'about', 'contact']},
    }),
    defineField({name: 'heroImage', type: 'image', title: 'Hero image', options: {hotspot: true}}),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Sections',
      of: [
        {type: 'section.heroComposer'},
        {type: 'section.essay'},
        {type: 'section.practiceHighlights'},
        {type: 'section.seriesOverview'},
        {type: 'section.featuredExhibition'},
        {type: 'section.artworkCarousel'},
        {type: 'section.techniquesOverview'},
        {type: 'section.practicePhases'},
        {type: 'section.mediaArchive'},
      ],
    }),
    defineField({name: 'seo', type: 'seo', title: 'SEO'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'template',
      media: 'heroImage',
    },
  },
})
