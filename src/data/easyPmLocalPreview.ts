import type { PageData } from '../lib/pageLoader';
import type { Sections } from '../types/sections';

const paragraphs = (...values: string[]) => values.map((value, index) => ({
  _type: 'block' as const,
  _key: `paragraph-${index}`,
  style: 'normal' as const,
  markDefs: [],
  children: [{ _type: 'span' as const, _key: 'span', text: value, marks: [] }],
}));
const text = (value: string) => paragraphs(value);

const phone = 'tel:+12674407306';
const hero = (title: string, subtitle: string, body: string, secondaryLabel = 'Explore Our Services', secondaryLink = '/services/') => ({
  _type: 'heroSection' as const,
  title,
  subtitle,
  body: text(body),
  primaryCtaLabel: 'Call 267-440-7306',
  primaryCtaLink: phone,
  secondaryCtaLabel: secondaryLabel,
  secondaryCtaLink: secondaryLink,
  layoutStyle: 'oneColumn' as const,
});

const estimateStrip = {
  _type: 'ctaSection' as const,
  visualVariant: 'figmaEstimateStrip' as const,
  heading: 'Discuss your service needs',
  layout: 'twoColumn' as const,
  layoutStyle: 'fullWidth' as const,
  primaryButton: { label: 'Contact', link: '/contact/' },
};

const propertyCards = {
  _type: 'processSection' as const,
  visualVariant: 'figmaPhotoCards' as const,
  title: 'Help for your property',
  subtitle: 'Tell EasyPM what you have noticed and where you need service.',
  backgroundTheme: 'white' as const,
  columns: 3 as const,
  steps: [
    { label: 'Treatment options', image: { url: '/images/easypm-treatment-photo-figma-watermarked.webp', alt: 'Technician preparing pest treatment in the Figma prototype' } },
    { label: 'Discreet service', image: { url: '/images/easypm-about-service-van-figma.webp', alt: 'Service vehicle from the EasyPM Figma design' } },
    { label: 'K9 inspections', image: { url: '/images/easypm-k9-photo-figma.webp', alt: 'Inspection dog from the EasyPM Figma design' } },
  ],
};

const reasonsCards = {
  _type: 'processSection' as const,
  visualVariant: 'figmaBadgeCards' as const,
  title: 'Why choose EasyPM?',
  subtitle: 'Start with a conversation about the property, the concern and the options available.',
  backgroundTheme: 'cream' as const,
  columns: 4 as const,
  steps: [
    { label: 'Service for homes', description: text('Tell us what is happening in your home and ask about next steps.') },
    { label: 'Service for businesses', description: text('Discuss your property and scheduling needs with EasyPM.') },
    { label: 'Treatment choices', description: text('Ask about available methods and what each would involve.') },
    { label: 'A clear next step', description: text('Understand the recommendation before deciding how to proceed.') },
  ],
};

const processCards = {
  _type: 'processSection' as const,
  visualVariant: 'figmaIconCards' as const,
  title: 'How to get started',
  subtitle: 'Discuss the options for your property with EasyPM.',
  backgroundTheme: 'white' as const,
  columns: 3 as const,
  steps: [
    { label: 'Tell us your concern', description: text('Share what you have noticed, your location and the type of property.') },
    { label: 'Discuss options', description: text('Ask about inspection or treatment options and the expected costs.') },
    { label: 'Choose a next step', description: text('Decide whether to arrange the recommended service for your property.') },
  ],
};

const pages: Record<string, PageData> = {
  home: {
    title: 'Bed Bug Treatment in Philadelphia | EasyPM',
    description: 'Explore bed bug heat treatment, Aprehend treatment and K9 inspections with EasyPM. Serving Philadelphia and surrounding areas. Call 267-440-7306.',
    sections: [
      {
        ...hero('Take the next step toward a bed bug free property', 'Bed bug help for homes and businesses', 'Worried about bed bugs? EasyPM helps you understand your options and choose a treatment plan for your property. We offer heat treatment, Aprehend treatment and K9 inspections in Philadelphia and surrounding areas.'),
        visualVariant: 'figmaHeader',
        layoutStyle: 'twoColumn',
        mediaType: 'video',
        videoUrl: 'https://www.youtube.com/embed/PH3786NxmIE',
        bullets: ['Locally owned', 'Residential and commercial service', 'Discreet approach'],
        backgroundImage: { url: '/images/easypm-home-hero.webp', alt: 'Pest professional in protective gear applying a treatment outside a home' },
      },
      {
        _type: 'serviceGridSection',
        title: 'Bed bug services built around your situation',
        description: 'Whether you need help identifying a problem or choosing a treatment, start with a conversation about what you have noticed and where.',
        visualVariant: 'floatingThree',
        alignment: 'center', layoutStyle: 'stacked',
        items: [
          { label: 'Bed Bug Heat Treatment', description: 'Ask about professional heat treatment for your property and what the treatment would involve.', icon: { url: '/images/easypm-heat-icon-figma.webp', alt: 'Clock and heat treatment symbol' }, linkLabel: 'View Heat Treatment', linkUrl: '/services/bed-bug-control/#heat-treatment' },
          { label: 'Aprehend Treatment', description: 'Explore Aprehend as a bed bug treatment option and discuss whether it fits your property and circumstances.', icon: { url: '/images/easypm-aprehend-icon-figma.webp', alt: 'Aprehend biological bed bug control professional logo' }, linkLabel: 'View Aprehend Treatment', linkUrl: '/services/bed-bug-control/#aprehend-treatment' },
          { label: 'K9 Bed Bug Inspections', description: 'Not sure whether bed bugs are present? Ask about a canine inspection to help investigate your concern.', icon: { url: '/images/easypm-k9-icon-figma.webp', alt: 'Colorful K9 inspection shield with hands' }, linkLabel: 'View K9 Inspections', linkUrl: '/services/bed-bug-control/#k9-inspection' },
        ],
      },
      {
        _type: 'twoColTextImageSection', anchorId: 'our-approach',
        title: 'A difficult problem deserves a straightforward conversation',
        description: paragraphs('A bed bug concern can leave you with more questions than answers. What treatment should you choose? What will it cost? What happens next? EasyPM starts by discussing your situation, explaining the available options and helping you make an informed decision.', 'Your privacy matters, too. Our approach to service is discreet and professional, whether the property is your home or your business.'),
        images: [
          { url: '/images/easypm-treatment-photo-figma-watermarked.webp', alt: 'Prototype photo of a pest technician preparing a treatment inside a room' },
          { url: '/images/easypm-section1-treatment-figma-watermarked.webp', alt: 'Prototype photo of a pest technician carrying treatment equipment outdoors' },
        ],
        imagePlacement: 'imageRight', backgroundTheme: 'white',
      },
      estimateStrip,
      { _type: 'twoColTextImageSection', title: 'Residential and commercial service', description: paragraphs('EasyPM serves homes and business properties in Philadelphia and surrounding areas. Tell us about your location, property and concern to discuss the available options.'), images: [{ url: '/images/easypm-service-area-homes-figma.webp', alt: 'Four residential properties in the EasyPM Figma design' }], imagePlacement: 'imageRight', backgroundTheme: 'darkGreen', ctaLabel: 'Ask About Service', ctaLink: '/contact/' },
      reasonsCards,
      propertyCards,
    ] as Sections[],
  },
  services: {
    title: 'Bed Bug Inspection and Treatment Services | EasyPM',
    description: 'Compare EasyPM bed bug services, including heat treatment, Aprehend treatment and K9 inspections. Get help choosing an approach for your property.',
    sections: [
      { ...hero('Bed bug inspection and treatment options', 'Our Services', 'Every inquiry starts with your property and your concerns. EasyPM offers heat treatment, Aprehend treatment and K9 inspections, with options for both residential and commercial properties.'), primaryCtaLabel: 'Discuss Your Options', primaryCtaLink: '/contact/', secondaryCtaLabel: 'Call 267-440-7306', secondaryCtaLink: phone, visualVariant: 'figmaHeader', backgroundImage: { url: '/images/easypm-services-hero-figma.webp', alt: 'Philadelphia skyline at dusk from the Bed Bug Control Figma frame' }, sideImage: { url: '/images/easypm-bedbug-service-figma.webp', alt: 'Bed bug crossed out by a purple prohibition symbol in the EasyPM Figma design' }, sideImageFit: 'contain' },
      { _type: 'twoColTextImageSection', anchorId: 'heat-treatment', title: 'Bed Bug Heat Treatment', description: paragraphs('Professional heat treatment is one of the bed bug treatment options available from EasyPM. If you are considering heat, talk to us about the spaces affected and how the treatment would fit your property.', 'Before you arrange service, ask about the expected treatment schedule, preparation and any arrangements needed for occupants or belongings. The details should be clear before you decide to proceed.'), images: [{ url: '/images/easypm-heat-icon-figma.webp', alt: 'Figma heat treatment clock illustration' }], mediaFit: 'contain', ctaLabel: 'Ask About Heat Treatment', ctaLink: '/contact/', imagePlacement: 'imageRight', backgroundTheme: 'white' },
      { _type: 'twoColTextImageSection', anchorId: 'aprehend-treatment', title: 'Aprehend Bed Bug Treatment', description: paragraphs('EasyPM also offers Aprehend treatment. If you are comparing treatment methods, we can discuss this option alongside heat treatment and explain the recommendation for your situation.', 'Ask about the treatment plan, the costs involved and what to expect afterward. Choosing a service is easier when you understand what is being recommended and why.'), images: [{ url: '/images/easypm-aprehend-icon-figma.webp', alt: 'Aprehend treatment logo exported from the EasyPM Figma design' }], mediaFit: 'contain', ctaLabel: 'Ask About Aprehend', ctaLink: '/contact/', imagePlacement: 'imageLeft', backgroundTheme: 'cream' },
      { _type: 'twoColTextImageSection', anchorId: 'k9-inspection', title: 'K9 Bed Bug Inspections', description: paragraphs('When you are unsure whether bed bugs are present, ask EasyPM about K9 inspection. Canine inspections are an available option for homes, hotels and other businesses.', 'Tell us what you have noticed, where the concern started and the type of property involved. We can discuss whether a K9 inspection is a suitable next step.'), videoUrl: 'https://www.youtube.com/embed/PH3786NxmIE', ctaLabel: 'Ask About K9 Inspection', ctaLink: '/contact/', imagePlacement: 'imageRight', backgroundTheme: 'white' },
      { _type: 'iconGridSection', title: 'Help for homes and businesses', columns: 2, items: [{ label: 'Your home', description: 'If a bed bug concern is disrupting your home life, start by explaining the problem. Ask about your options, the treatment process and the arrangements you may need to make.' }, { label: 'Your business', description: 'If you are responsible for a business property, tell us about the building and the concern. Discuss service requirements and timing with EasyPM before making a plan.' }] },
    ] as Sections[],
  },
  'service-area': {
    title: 'Philadelphia Bed Bug Service Area | EasyPM',
    description: 'EasyPM serves Philadelphia and surrounding areas. Contact us with your city or ZIP code to check bed bug inspection and treatment availability.',
    sections: [
      { ...hero('Bed bug services in Philadelphia and surrounding areas', 'Service Area', 'Looking for bed bug help near you? EasyPM provides inspection and treatment options for residential and commercial properties in the Philadelphia area.'), primaryCtaLabel: 'Check Availability', primaryCtaLink: '/contact/', secondaryCtaLabel: 'Call 267-440-7306', secondaryCtaLink: phone, visualVariant: 'figmaHeader', backgroundImage: { url: '/images/easypm-service-area-hero-figma.webp', alt: 'Philadelphia city skyline after dark from the Service Area Figma frame' }, sideImage: { url: '/images/easypm-service-area-homes-figma.webp', alt: 'Four types of residential properties shown in the Service Area Figma design' }, sideImageFit: 'contain' },
      { _type: 'serviceAreaSection', title: 'Start with your location', description: 'Tell us your city or ZIP code and the type of property that needs attention. We can discuss whether service is available at your location and the next step for your inquiry. Outside Philadelphia? Contact us to check your location in the surrounding area.', communities: [{ label: 'Philadelphia, PA' }] },
      { _type: 'iconGridSection', title: 'What to have ready when you contact us', columns: 3, items: [
        { label: 'Your location', description: 'Share the city or ZIP code where service is needed.', icon: { url: '/images/easypm-map-icon-figma.webp', alt: 'Location marker from the EasyPM Figma design' } },
        { label: 'Your property', description: 'Let us know whether your inquiry is for a home, hotel or another business property.' },
        { label: 'Your concern', description: 'Describe what you have noticed and the areas involved. If you are unsure whether bed bugs are present, ask about inspection options.' },
      ] },
      { _type: 'faqSection', title: 'Service area questions', faqs: [
        { question: 'Do you serve locations outside Philadelphia?', answer: 'EasyPM serves Philadelphia and surrounding areas. Contact us with your city or ZIP code to confirm your location.' },
        { question: 'Can you help a commercial property in the area?', answer: 'EasyPM offers residential and commercial bed bug services. Tell us about the location and property so we can discuss your inquiry.' },
        { question: 'Can I check availability before deciding on treatment?', answer: 'Yes. Start by calling with your location and concern. You can discuss treatment options before deciding how to proceed.' },
      ] },
    ] as Sections[],
  },
  'about-us': {
    title: 'About EasyPM | Philadelphia Bed Bug Services',
    description: 'Meet EasyPM, a locally owned bed bug service business serving Philadelphia and surrounding areas with inspection and treatment options.',
    sections: [
      { ...hero('Local bed bug help with a personal approach', 'About EasyPM', 'Easy Pest Management is a locally owned and operated business serving Philadelphia and surrounding areas. We help homeowners and businesses explore bed bug inspection and treatment options.', 'Explore Our Services', '/services/'), primaryCtaLabel: 'Talk to EasyPM', primaryCtaLink: '/contact/', visualVariant: 'figmaHeader', backgroundImage: { url: '/images/easypm-about-hero-figma.webp', alt: 'Quiet bedroom interior from the About EasyPM Figma design' } },
      { _type: 'twoColTextImageSection', title: 'Clear options when you need them', description: paragraphs('A bed bug problem can be stressful to discuss. We want the next step to feel manageable: explain what you have noticed, ask your questions and understand the available options before making a decision.', 'Our services include heat treatment, Aprehend treatment and K9 inspections. We discuss treatment choices and costs with you before you decide whether to proceed.'), videoUrl: 'https://www.youtube.com/embed/PH3786NxmIE', imagePlacement: 'imageRight', backgroundTheme: 'cream' },
      { _type: 'iconGridSection', title: 'What you can expect from the conversation', columns: 3, items: [{ label: 'Space for your questions', description: 'Tell us what concerns you most and ask about the treatment choices available for your property.' }, { label: 'A discreet approach', description: 'We understand that privacy matters when you are dealing with a bed bug concern at home or at work.' }, { label: 'An informed decision', description: 'Discuss the recommended approach and its costs before deciding whether to arrange treatment.' }] },
      { _type: 'twoColTextImageSection', title: 'Support for residential and commercial properties', description: text('Whether you are calling about your home or a business you manage, your property is the starting point. Tell us where service is needed, what you have noticed and the questions you need answered.'), ctaLabel: 'View Our Services', ctaLink: '/services/', imagePlacement: 'imageRight', backgroundTheme: 'white' },
    ] as Sections[],
  },
  blog: {
    title: 'Bed Bug Information and Resources | EasyPM',
    description: 'Find EasyPM bed bug resources and get help with questions about inspection and treatment. Contact us for guidance about your own property.',
    sections: [
      { ...hero('A place to start with your bed bug questions', 'EasyPM Blog', 'Looking for information before you make a decision? Use this page to explore EasyPM resources and find your way to the inspection or treatment information you need.', 'Ask EasyPM a Question', '/contact/'), primaryCtaLabel: 'Explore Our Services', primaryCtaLink: '/services/', visualVariant: 'figmaHeader', bannerSize: 'compact', backgroundImage: { url: '/images/easypm-home-hero.webp', alt: 'Pest professional in protective gear from the EasyPM Home Figma banner' } },
      { _type: 'serviceGridSection', title: 'What would you like to know?', alignment: 'center', layoutStyle: 'stacked', items: [
        { label: 'Your treatment options', description: 'See the services EasyPM offers and the questions to ask when comparing approaches.', icon: { url: '/images/easypm-heat-icon-figma.webp', alt: 'Heat treatment symbol from the EasyPM Figma design' }, linkLabel: 'Explore Our Services', linkUrl: '/services/' },
        { label: 'Inspection options', description: 'If you are unsure whether bed bugs are present, find out about K9 inspections and how to make an inquiry.', icon: { url: '/images/easypm-k9-icon-figma.webp', alt: 'K9 inspection symbol from the EasyPM Figma design' }, linkLabel: 'Read About K9 Inspections', linkUrl: '/services/bed-bug-control/#k9-inspection' },
        { label: 'Service near you', description: 'Check our Philadelphia service area and contact us about your location.', icon: { url: '/images/easypm-map-icon-figma.webp', alt: 'Location marker from the EasyPM Figma design' }, linkLabel: 'View Our Service Area', linkUrl: '/service-area/' },
      ] },
      { _type: 'blogListSection', title: 'Bed bug articles', description: 'Browse available articles for more information, or contact EasyPM with a question about your property.', emptyStateText: 'There are no articles to show yet. You can still explore our services or contact us with your bed bug questions.', emptyStateCtaLabel: 'Explore Our Services', emptyStateCtaLink: '/services/' },
    ] as Sections[],
  },
  contact: {
    title: 'Contact EasyPM | Bed Bug Help in Philadelphia',
    description: 'Call EasyPM at 267-440-7306 to discuss bed bug inspection and treatment in Philadelphia and surrounding areas, or send an inquiry about your property.',
    sections: [
      { ...hero('Tell us about your bed bug concern', 'Contact EasyPM', 'Start with your location and what you have noticed. Whether you need an inspection or want to discuss treatment, we can help you understand the available options.', 'Send an Inquiry', '#contact_form'), visualVariant: 'figmaHeader', bannerSize: 'compact', backgroundImage: { url: '/images/easypm-k9-banner-figma.webp', alt: 'Two light-colored dogs from the Contact Figma banner' } },
      {
        _type: 'leadFormSection', visualVariant: 'figmaContact', eyebrow: 'Get in touch', title: 'Send an inquiry about your property', submitLabel: 'Send Inquiry', contactPhone: '267-440-7306', serviceArea: 'Philadelphia, PA and surrounding areas',
        backgroundArtLeft: { url: '/images/easypm-contact-form-backdrop-left-figma.webp', alt: 'Abstract house outline on the left side of the Contact Figma design' },
        backgroundArtRight: { url: '/images/easypm-contact-form-backdrop-right-figma.webp', alt: 'Abstract house outline on the right side of the Contact Figma design' },
        subtitle: 'Share a few details so we can understand your inquiry. Please include your city or ZIP code and describe what you have noticed.',
        successMessage: 'Thank you. Your inquiry has been sent to EasyPM.',
        errorMessage: 'Your inquiry could not be sent. Please try again or call 267-440-7306.',
        fields: [
          { _key: 'fullName', name: 'fullName', label: 'Full name', placeholder: 'Your name', type: 'text', required: true, width: 'half' },
          { _key: 'phone', name: 'phone', label: 'Phone number', placeholder: '267-555-0123', type: 'tel', required: true, width: 'half' },
          { _key: 'email', name: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', required: false, width: 'half' },
          { _key: 'location', name: 'cityOrZip', label: 'City or ZIP code', placeholder: 'Philadelphia, PA', type: 'text', required: true, width: 'half' },
          { _key: 'propertyType', name: 'propertyType', label: 'Property type', placeholder: 'Choose a property type', type: 'select', required: true, width: 'half', options: [
            { label: 'Home', value: 'home' }, { label: 'Hotel', value: 'hotel' }, { label: 'Other business property', value: 'business' }, { label: 'Other', value: 'other' },
          ] },
          { _key: 'inquiryType', name: 'inquiryType', label: 'What can we help with?', placeholder: 'Choose a topic', type: 'select', required: true, width: 'half', options: [
            { label: 'Possible bed bug activity', value: 'possible-activity' }, { label: 'Heat treatment', value: 'heat-treatment' }, { label: 'Aprehend treatment', value: 'aprehend-treatment' }, { label: 'K9 inspection', value: 'k9-inspection' }, { label: 'Cockroach control', value: 'cockroach-control' }, { label: 'Termite control', value: 'termite-control' }, { label: 'Other question', value: 'other' },
          ] },
          { _key: 'message', name: 'message', label: 'Tell us about your concern', placeholder: 'Include where you have noticed activity and any questions you would like to ask.', type: 'textarea', required: false, width: 'full', rows: 4 },
        ],
      },
      { _type: 'twoColTextImageSection', title: 'A conversation before a decision', description: paragraphs('We will discuss your situation, the available options and the costs involved. You can ask questions before deciding whether to arrange treatment.', 'Prefer to talk? Call 267-440-7306.'), imagePlacement: 'imageRight', backgroundTheme: 'cream' },
    ] as Sections[],
  },
};

const bedBugServicePage = pages.services;
pages['services/bed-bug-control'] = {
  ...bedBugServicePage,
  title: 'Bed Bug Control in Philadelphia | EasyPM',
  sections: [
    { ...bedBugServicePage.sections[0], title: 'Bed Bug Control', subtitle: 'Bed Bug Control' },
    { _type: 'iconGridSection', title: 'Bed bug service for Philadelphia properties', colorTheme: 'darkGreen', columns: 2, items: [
      { label: 'Locally owned', description: 'Talk directly with EasyPM about service for your property.' },
      { label: 'Residential and commercial', description: 'Discuss a concern at home or at a business property.' },
      { label: 'Heat treatment', description: 'Ask whether heat treatment is suitable for the affected areas.' },
      { label: 'Aprehend treatment', description: 'Compare available treatment approaches before deciding.' },
      { label: 'K9 inspection', description: 'Ask about inspection when you are unsure whether bed bugs are present.' },
      { label: 'Clear next steps', description: 'Discuss the plan and costs before arranging service.' },
    ] },
    propertyCards,
    estimateStrip,
    { ...processCards, backgroundTheme: 'darkGreen' },
    ...bedBugServicePage.sections.slice(1, 4).map((section) => section._type === 'twoColTextImageSection' && section.anchorId === 'k9-inspection'
      ? { ...section, videoUrl: undefined, images: [{ url: '/images/easypm-k9-photo-figma.webp', alt: 'K9 inspection dog from the EasyPM Figma design' }] }
      : section),
  ] as Sections[],
};

pages.services = {
  title: 'Pest Control Services | EasyPM',
  description: 'Explore the EasyPM service pages for bed bug, cockroach and termite control, and contact us about your property.',
  sections: [
    { ...hero('Pest control services for your property', 'Our Services', 'Explore the service you need and tell EasyPM about your property, location and concern.', 'Call 267-440-7306', phone), primaryCtaLabel: 'Discuss Your Options', primaryCtaLink: '/contact/', visualVariant: 'figmaHeader', backgroundImage: { url: '/images/easypm-services-hero-figma.webp', alt: 'Philadelphia skyline from the EasyPM Figma service frames' } },
    { _type: 'serviceGridSection', title: 'Explore our services', description: 'Choose a service to see its page, then contact EasyPM about your specific property.', visualVariant: 'floatingThree', items: [
      { label: 'Bed Bug Control', description: 'Review bed bug heat treatment, Aprehend treatment and K9 inspections.', icon: { url: '/images/easypm-bedbug-service-badge-figma.webp', alt: 'Bed bug control badge with a crossed-out bed bug' }, linkLabel: 'View Bed Bug Control', linkUrl: '/services/bed-bug-control/' },
      { label: 'Cockroach Control', description: 'See the cockroach control page and ask EasyPM about an inspection or service.', icon: { url: '/images/easypm-cockroach-service-figma.webp', alt: 'Cockroach control badge with a crossed-out cockroach' }, linkLabel: 'View Cockroach Control', linkUrl: '/services/cockroach-control/' },
      { label: 'Termite Control', description: 'See the termite control page and ask EasyPM about the next step for your property.', icon: { url: '/images/easypm-termite-service-figma.webp', alt: 'Termite control badge with a crossed-out termite' }, linkLabel: 'View Termite Control', linkUrl: '/services/termite-control/' },
    ] },
    { _type: 'twoColTextImageSection', title: 'Service starts with your property', description: paragraphs('Tell us where service is needed, what you have noticed and any questions you have. EasyPM can discuss the options available before you decide how to proceed.'), images: [{ url: '/images/easypm-service-area-homes-figma.webp', alt: 'Four residential properties from the EasyPM Figma design' }], ctaLabel: 'Contact EasyPM', ctaLink: '/contact/', imagePlacement: 'imageRight', backgroundTheme: 'white' },
  ] as Sections[],
};

pages['services/cockroach-control'] = {
  title: 'Cockroach Control in Philadelphia | EasyPM',
  description: 'Explore EasyPM cockroach control and contact the team about your property in Philadelphia and surrounding areas.',
  sections: [
    { ...hero('Cockroach Control', 'Cockroach Control', 'If you have seen cockroaches or signs of activity, tell EasyPM what you have noticed and where. We can discuss the next step for your property.'), visualVariant: 'figmaHeader', layoutStyle: 'twoColumn', backgroundImage: { url: '/images/easypm-services-hero-figma.webp', alt: 'Philadelphia skyline used across the EasyPM Figma service frames' }, primaryCtaLabel: 'Contact EasyPM', primaryCtaLink: '/contact/' },
    estimateStrip,
    { ...propertyCards, title: 'Help for your property', subtitle: 'Contact EasyPM about a cockroach concern in your home or business.' },
    reasonsCards,
    { _type: 'twoColTextImageSection', title: 'Signs of cockroach activity', description: paragraphs('If you have found cockroaches or evidence of activity, make a note of where you saw them and when. Share those details with EasyPM so the team can understand your concern and discuss inspection or service options.'), ctaLabel: 'Ask About Cockroach Control', ctaLink: '/contact/', imagePlacement: 'imageLeft', backgroundTheme: 'white' },
  ] as Sections[],
};

pages['services/termite-control'] = {
  title: 'Termite Control in Philadelphia | EasyPM',
  description: 'Explore EasyPM termite control and contact the team about a concern at your property in Philadelphia and surrounding areas.',
  sections: [
    { ...hero('Termite Control', 'Termite Control', 'If you are concerned about possible termite activity, tell EasyPM what you have noticed and where. Ask about the next step for your property.'), visualVariant: 'figmaHeader', layoutStyle: 'twoColumn', backgroundImage: { url: '/images/easypm-services-hero-figma.webp', alt: 'Philadelphia skyline used across the EasyPM Figma service frames' }, primaryCtaLabel: 'Contact EasyPM', primaryCtaLink: '/contact/' },
    processCards,
    estimateStrip,
    { _type: 'twoColTextImageSection', title: 'When you suspect termites', description: paragraphs('Tell EasyPM where you have noticed possible termite activity or damage. Share your property type and location so we can discuss an appropriate next step.'), ctaLabel: 'Ask About Termite Control', ctaLink: '/contact/', imagePlacement: 'imageLeft', backgroundTheme: 'white' },
    { _type: 'twoColTextImageSection', title: 'A closer look at the property', description: paragraphs('Wood damage and other signs can have different causes. Explain what you have seen and ask EasyPM about inspection before making treatment decisions.'), ctaLabel: 'Contact EasyPM', ctaLink: '/contact/', imagePlacement: 'imageRight', backgroundTheme: 'white' },
  ] as Sections[],
};

const serviceAreaHero = pages['service-area'].sections[0];
pages['service-area'] = {
  ...pages['service-area'],
  sections: [
    serviceAreaHero,
    estimateStrip,
    { _type: 'twoColTextImageSection', title: 'Bed bug help in the Philadelphia area', description: paragraphs('EasyPM serves Philadelphia and surrounding areas. Contact us with your city or ZIP code to confirm whether service is available at your property.', 'Tell us whether the inquiry is for a home or a business and describe what you have noticed.'), images: [{ url: '/images/easypm-service-area-homes-figma.webp', alt: 'Residential properties pictured in the EasyPM Service Area Figma frame' }], imagePlacement: 'imageRight', backgroundTheme: 'cream', ctaLabel: 'Check Availability', ctaLink: '/contact/' },
    processCards,
  ] as Sections[],
};

const aboutHero = pages['about-us'].sections[0];
pages['about-us'] = {
  ...pages['about-us'],
  sections: [
    aboutHero,
    estimateStrip,
    { _type: 'twoColTextImageSection', title: 'Our mission', description: paragraphs('A pest concern can be stressful. EasyPM helps people in Philadelphia and surrounding areas understand the available inspection and treatment options and choose a next step for their property.'), images: [{ url: '/images/easypm-about-service-van-figma.webp', alt: 'EasyPM service vehicle from the Figma design' }], imagePlacement: 'imageRight', backgroundTheme: 'cream', ctaLabel: 'Talk to EasyPM', ctaLink: '/contact/' },
    propertyCards,
    reasonsCards,
  ] as Sections[],
};

const contactForm = pages.contact.sections.find((section) => section._type === 'leadFormSection');
pages.contact = {
  ...pages.contact,
  sections: contactForm ? [{ ...contactForm, headingLevel: 'h1' }] : [],
};

export const easyPmLocalPreviewSettings = {
  brandLogo: { url: '/images/easypm-logo-figma.webp', alt: 'Easy Pest Management logo' },
  contact: { companyName: 'EasyPM', phone: '267-440-7306', city: 'Philadelphia', state: 'PA' },
  navigationItems: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: 'Service Area', href: '/service-area/' },
    { label: 'About Us', href: '/about-us/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ],
  headerCtaLabel: 'Contact',
  headerCtaLink: '/contact/',
  footerDescription: 'Bed bug inspection and treatment for homes and businesses in Philadelphia and surrounding areas.',
  footerCtaHeading: 'FREE K-9 BUG INSPECTION',
  footerCtaButtonLabel: 'Contact',
  footerCtaButtonLink: '/contact/',
  footerBannerImage: { url: '/images/easypm-k9-banner-figma.webp', alt: 'K9 banner photo from the EasyPM Figma design' },
  footerGradientImage: { url: '/images/easypm-cta-gradient-clean-figma.webp', alt: 'Purple gradient from the EasyPM Figma call-to-action banner' },
  footerLinks: [
    { label: 'Home', href: '/' }, { label: 'Services', href: '/services/' },
    { label: 'Service Area', href: '/service-area/' }, { label: 'About Us', href: '/about-us/' },
    { label: 'Blog', href: '/blog/' }, { label: 'Contact', href: '/contact/' },
  ],
};

export function getEasyPmLocalPreviewPage(slug: string): PageData | null {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '') || 'home';
  return pages[normalized] ?? null;
}
