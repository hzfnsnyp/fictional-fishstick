import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'socialLinks',
  title: 'Social links',
  type: 'object',
  fields: [
    defineField({name: 'instagram', type: 'url', title: 'Instagram', validation: Rule => Rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'twitter', type: 'url', title: 'Twitter/X', validation: Rule => Rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'facebook', type: 'url', title: 'Facebook', validation: Rule => Rule.uri({scheme: ['http', 'https']})}),
  ],
})
