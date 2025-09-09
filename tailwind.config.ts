import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { 
      center: true, 
      padding: '1rem',
      screens: { 
        sm: '640px',
        md: '768px',
        lg: '1120px', 
        xl: '1240px' 
      } 
    },
    extend: {
      colors: {
        base: {
          canvas: '#EEF2FF',
          glass: 'rgba(255,255,255,0.40)',
          ring: 'rgba(255,255,255,0.25)'
        }
      },
      borderRadius: { 
        xl: '1.25rem', 
        '2xl': '1.75rem', 
        pill: '9999px' 
      },
      boxShadow: {
        glass: '0 1px 1px rgba(18,24,40,.04), 0 20px 40px rgba(93,76,255,.05)',
        glow: '0 0 0 4px rgba(124,58,237,.15)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}

export default config
