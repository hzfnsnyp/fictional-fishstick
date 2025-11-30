import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', title: 'Label', validation: Rule => Rule.required()}),
    defineField({
      name: 'href',
      type: 'string',
      title: 'Href',
      validation: Rule =>
        Rule.required().custom(value => {
          if (!value) return true
          const ok = value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')
          return ok || 'Use absolute https://… or site-relative /path'
        }),
    }),
  ],
})
