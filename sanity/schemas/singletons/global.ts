import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'global',
  title: 'Global settings',
  type: 'document',
  fields: [
    defineField({name: 'siteName', type: 'string', title: 'Site name', validation: Rule => Rule.required()}),
    defineField({name: 'siteUrl', type: 'url', title: 'Site URL', validation: Rule => Rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'maintenanceMode', type: 'boolean', title: 'Maintenance mode'}),
    defineField({name: 'maintenanceMessage', type: 'text', title: 'Maintenance message'}),
    defineField({
      name: 'contactEmail',
      type: 'string',
      title: 'Contact email',
      validation: Rule =>
        Rule.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, {name: 'email', invert: false}).warning('Enter a valid email'),
    }),
    defineField({name: 'socialLinks', type: 'socialLinks', title: 'Social links'}),
    defineField({
      name: 'navigationLinks',
      type: 'array',
      title: 'Navigation links',
      of: [{type: 'navLink'}],
    }),
    defineField({
      name: 'footerLinks',
      type: 'array',
      title: 'Footer links',
      of: [{type: 'navLink'}],
    }),
    defineField({name: 'defaultSeo', type: 'seo', title: 'Default SEO'}),
    defineField({name: 'logo', type: 'image', title: 'Logo', options: {hotspot: true}}),
    defineField({name: 'favicon', type: 'image', title: 'Favicon', options: {hotspot: true}}),
  ],
  preview: {
    prepare: () => ({title: 'Global settings'}),
  },
})
