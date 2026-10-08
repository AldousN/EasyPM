import { LuClipboardList } from 'react-icons/lu';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const leadFormSection = defineType({
  name: 'leadFormSection',
  title: 'Lead Form Section',
  type: 'object',
  description: 'Reusable lead capture form with configurable fields and success messaging.',
  icon: LuClipboardList,
  fields: [
    defineField({
      name: 'visualVariant', title: 'Visual Variant', type: 'string',
      options: { list: [
        { title: 'Standard', value: 'standard' },
        { title: 'Figma Contact', value: 'figmaContact' }
      ] }, initialValue: 'standard'
    }),
    defineField({ name: 'contactPhone', title: 'Contact Phone', type: 'string', hidden: ({ parent }) => parent?.visualVariant !== 'figmaContact' }),
    defineField({ name: 'serviceArea', title: 'Service Area', type: 'string', hidden: ({ parent }) => parent?.visualVariant !== 'figmaContact' }),
    defineField({ name: 'backgroundArtLeft', title: 'Left Background Artwork', type: 'image', options: { hotspot: true }, hidden: ({ parent }) => parent?.visualVariant !== 'figmaContact', fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() })] }),
    defineField({ name: 'backgroundArtRight', title: 'Right Background Artwork', type: 'image', options: { hotspot: true }, hidden: ({ parent }) => parent?.visualVariant !== 'figmaContact', fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() })] }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'headingLevel', title: 'Heading level', type: 'string',
      options: { list: [{ title: 'Page heading (H1)', value: 'h1' }, { title: 'Section heading (H2)', value: 'h2' }] },
      initialValue: 'h2'
    }),
    defineField({ name: 'submitLabel', title: 'Submit Button Label', type: 'string' }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Headline that appears above the form.'
    }),
    defineField({
      name: 'highlightText',
      title: 'Highlighted Title Text',
      type: 'string',
      description: 'Word or phrase within the title to render in red italic.'
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      rows: 3,
      description: 'Optional supporting copy rendered under the headline.'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Use for short reassurance copy or bullet lists above the form.'
    }),
    defineField({
      name: 'logo',
      title: 'Form Logo',
      type: 'image',
      description: 'Optional logo displayed at the top of the form card.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })]
    }),
    defineField({
      name: 'backgroundTheme',
      title: 'Background Theme',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Dark Green', value: 'darkGreen' },
          { title: 'Cream', value: 'cream' },
          { title: 'Olive Green', value: 'oliveGreen' }
        ],
        layout: 'radio'
      },
      initialValue: 'white'
    }),
    defineField({
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'center' },
          { title: 'Left Aligned', value: 'left' }
        ],
        layout: 'radio'
      },
      initialValue: 'center'
    }),
    defineField({
      name: 'formAction',
      title: 'Form Action (Optional)',
      type: 'url',
      description: 'Defaults to /api/contact unless overridden here or via PUBLIC_AUTOMATION_WEBHOOK_URL.'
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: 'Thank you. Your inquiry has been sent to EasyPM.',
      description: 'Shown after a successful submission.'
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'string',
      initialValue: 'Your inquiry could not be sent. Please try again or call 267-440-7306.',
      description: 'Displayed when the form fails to submit.'
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formField',
          fields: [
            defineField({
              name: 'name',
              title: 'Field Name',
              type: 'string',
              description: 'Used as the input name attribute (e.g., firstName).',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string'
            }),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'tel' },
                  { title: 'Textarea', value: 'textarea' },
                  { title: 'Select', value: 'select' },
                  { title: 'Checkbox Group', value: 'checkboxGroup' }
                ],
                layout: 'radio'
              },
              initialValue: 'text'
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: true
            }),
            defineField({
              name: 'width',
              title: 'Field Width',
              type: 'string',
              options: {
                list: [
                  { title: 'Full', value: 'full' },
                  { title: 'Half', value: 'half' }
                ],
                layout: 'radio'
              },
              initialValue: 'full'
            }),
            defineField({
              name: 'rows',
              title: 'Textarea Rows',
              type: 'number',
              initialValue: 4,
              hidden: ({ parent }) => parent?.type !== 'textarea'
            }),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'option',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() })
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'value' }
                  }
                })
              ],
              hidden: ({ parent }) => !['select', 'checkboxGroup'].includes(parent?.type ?? ''),
              description: 'Required for select or checkbox groups.'
            })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'type'
            }
          }
        })
      ],
      validation: (Rule) => Rule.required().min(1)
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({
      title: title ?? 'Lead Form Section',
      subtitle: subtitle ? `Lead Form Section · ${subtitle}` : 'Lead Form Section',
      media: LuClipboardList
    })
  }
});
