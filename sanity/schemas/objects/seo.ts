import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', type: 'string', title: 'Meta title'}),
    defineField({name: 'metaDescription', type: 'text', rows: 3, title: 'Meta description'}),
    defineField({name: 'metaImage', type: 'image', title: 'Meta image', options: {hotspot: true}}),
    defineField({name: 'keywords', type: 'string', title: 'Keywords'}),
    defineField({name: 'canonicalURL', type: 'url', title: 'Canonical URL'}),
    defineField({name: 'noindex', type: 'boolean', title: 'Noindex'}),
  ],
})
