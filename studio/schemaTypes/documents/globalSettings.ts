import { LuSlidersHorizontal } from 'react-icons/lu';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  description: 'Single source for contact info, default SEO data, and reusable social links.',
  icon: LuSlidersHorizontal,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Used only inside Studio.',
      initialValue: 'Site Settings'
    }),
    defineField({
      name: 'contact',
      title: 'Contact Info',
      type: 'contactInfo',
      description: 'Populates the footer and structured data.',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'brandLogo',
      title: 'Brand Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })]
    }),
    defineField({
      name: 'navigationItems',
      title: 'Primary Navigation',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href', title: 'Link', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({
            name: 'children', title: 'Dropdown links', type: 'array',
            of: [defineArrayMember({ type: 'object', fields: [
              defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
              defineField({ name: 'href', title: 'Link', type: 'string', validation: (Rule) => Rule.required() })
            ] })],
            validation: (Rule) => Rule.max(6)
          })
        ]
      })],
      validation: (Rule) => Rule.max(8)
    }),
    defineField({ name: 'headerCtaLabel', title: 'Header CTA Label', type: 'string' }),
    defineField({ name: 'headerCtaLink', title: 'Header CTA Link', type: 'string' }),
    defineField({ name: 'footerDescription', title: 'Footer Description', type: 'text', rows: 3 }),
    defineField({ name: 'footerCtaHeading', title: 'Footer Call to Action Heading', type: 'string' }),
    defineField({ name: 'footerCtaText', title: 'Footer Call to Action Text', type: 'text', rows: 3 }),
    defineField({ name: 'footerCtaButtonLabel', title: 'Footer Button Label', type: 'string' }),
    defineField({ name: 'footerCtaButtonLink', title: 'Footer Button Link', type: 'string' }),
    defineField({ name: 'footerCtaSecondaryButtonLabel', title: 'Footer Secondary Button Label', type: 'string' }),
    defineField({ name: 'footerCtaSecondaryButtonLink', title: 'Footer Secondary Button Link', type: 'string' }),
    defineField({ name: 'footerBannerImage', title: 'Footer Banner Background', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
    defineField({ name: 'footerGradientImage', title: 'Footer Bottom Background', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href', title: 'Link', type: 'string', validation: (Rule) => Rule.required() })
        ]
      })]
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Fallback metadata when a page/blog post does not set custom SEO.',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Rendered in the footer and contact cards.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Ex: “Facebook” or “BBB Profile”.',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Full https link.',
              validation: (Rule) => Rule.required()
            })
          ]
        })
      ]
    })
  ],
  preview: { select: { title: 'title', subtitle: 'contact.companyName' } }
});
