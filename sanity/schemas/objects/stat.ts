import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'stat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({name: 'value', type: 'string', title: 'Value', validation: Rule => Rule.required()}),
    defineField({name: 'description', type: 'string', title: 'Description'}),
    defineField({name: 'title', type: 'string', title: 'Title'}),
  ],
})
