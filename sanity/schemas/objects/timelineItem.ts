import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'timelineItem',
  title: 'Timeline item',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required()}),
    defineField({name: 'period', type: 'string', title: 'Period'}),
    defineField({name: 'description', type: 'text', title: 'Description'}),
  ],
})
