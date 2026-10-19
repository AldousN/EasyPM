/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '!./studio/.sanity/**',
    '!./studio/node_modules/**',
    '!./node_modules/**',
    '!./dist/**',
    '!./.astro/**'
  ],
  theme: {
    extend: {
      colors: {
        'figma-primary': 'var(--figma-purple-primary)',
        'figma-interactive': 'var(--figma-purple-interactive)',
        'figma-secondary': 'var(--figma-purple-secondary)',
        'figma-base': 'var(--figma-surface-base)',
        'color-primary': 'var(--color-primary)',
        'color-secondary': 'var(--color-secondary)',
        'color-surface': 'var(--color-surface)',
        'color-panel': 'var(--color-panel)',
        'color-text-muted': 'var(--color-text-muted)',
        'color-dark': 'var(--color-dark)',
      },
      fontFamily: {
        'figma-heading': ['Inter', 'sans-serif'],
        'figma-body': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'figma-h1': ['var(--figma-h1-size)', { lineHeight: 'var(--figma-heading-leading)' }],
        'figma-h2': ['var(--figma-h2-size)', { lineHeight: 'var(--figma-heading-leading)' }],
        'figma-h3': ['var(--figma-h3-size)', { lineHeight: 'var(--figma-heading-leading)' }],
        'figma-body-l': ['var(--figma-body-l-size)', { lineHeight: 'var(--figma-body-l-leading)' }],
        'figma-body-s': ['var(--figma-body-s-size)', { lineHeight: 'var(--figma-body-s-leading)' }],
      },
    }
  },
  // Optimize for production
  safelist: [
    'text-primary',
    'bg-white',
    'text-slate-900',
    'text-color-primary'
  ]
};
