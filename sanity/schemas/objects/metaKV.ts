import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'metaKV',
  title: 'Meta key/value',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', title: 'Label', validation: Rule => Rule.required()}),
    defineField({name: 'value', type: 'string', title: 'Value', validation: Rule => Rule.required()}),
  ],
})
