/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '768px',
        'lg': '1280px',
        'xl': '1920px',
      },
      colors: {
        // Semânticas
        primary: 'var(--color-primary)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        // Primitivas do Figma
        'secondary-darker': 'var(--color-secondary-darker)',
        'secondary-normal': 'var(--color-secondary-normal)',
        'secondary-light': 'var(--color-secondary-light)',
        'surface-50': 'var(--color-surface-50)',
        'surface-700': 'var(--color-surface-700)',
        'background-400': 'var(--color-background-400)',
        'neutral-0': 'var(--color-neutral-0)',
        'neutral-300': 'var(--color-neutral-300)',
        'neutral-900': 'var(--color-neutral-900)',
        'blue-200': 'var(--color-blue-200)',
        'blue-600': 'var(--color-blue-600)',
        'green-100': 'var(--color-green-100)',
        'green-600': 'var(--color-green-600)',
        'red-600': 'var(--color-red-600)',
        lime: 'var(--color-lime)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-medium': ['28px', { lineHeight: '36px' }],
        'heading-small': ['24px', { lineHeight: '32px' }],
        'heading-xsmall': ['20px', { lineHeight: '28px' }],
        'label-large': ['18px', { lineHeight: '24px' }],
        'label-medium': ['16px', { lineHeight: '20px' }],
        'label-small': ['14px', { lineHeight: '16px' }],
        'label-xsmall': ['12px', { lineHeight: '16px' }],
        'paragraph-medium': ['16px', { lineHeight: '24px' }],
        'paragraph-small': ['14px', { lineHeight: '20px' }],
      },
      /* Tokens de espaçamento do Figma disponíveis como var(--space-N) */
      borderRadius: {
        'card': 'var(--shape-20)',
        'pill': 'var(--shape-100)',
      },
      maxWidth: {
        'content': '1400px',
        'content-xl': '1600px',
      },
    },
  },
  plugins: [],
}
