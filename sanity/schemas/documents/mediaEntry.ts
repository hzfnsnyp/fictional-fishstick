import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mediaEntry',
  title: 'Media entries',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required()}),
    defineField({name: 'label', type: 'string', title: 'Label', validation: Rule => Rule.required()}),
    defineField({name: 'meta', type: 'string', title: 'Meta'}),
    defineField({name: 'href', type: 'url', title: 'Link', validation: Rule => Rule.uri({allowRelative: true, scheme: ['http', 'https']})}),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {list: ['magazine', 'press', 'radio']},
    }),
    defineField({name: 'order', type: 'number', title: 'Order', validation: Rule => Rule.min(0)}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
