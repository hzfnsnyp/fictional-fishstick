import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mediaArchiveItem',
  title: 'Media archive item',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', title: 'Label', validation: Rule => Rule.required()}),
    defineField({name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required()}),
    defineField({name: 'meta', type: 'string', title: 'Meta'}),
    defineField({name: 'href', type: 'url', title: 'Link'}),
  ],
})
