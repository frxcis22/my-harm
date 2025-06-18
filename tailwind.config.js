/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: '#F9FAFB',
        foreground: '#1F2937',
        primary: '#007AFF',
        muted: '#6B7280',
        
        // Dark mode colors
        'background-dark': '#121212',
        'foreground-dark': '#F3F4F6',
        'primary-dark': '#3A7DFF',
        'muted-dark': '#9CA3AF',
        
        // Semantic colors
        border: '#E5E7EB',
        'border-dark': '#374151',
        card: '#FFFFFF',
        'card-dark': '#1F2937',
        
        // Additional semantic colors for consistency
        'ring-offset-background': '#F9FAFB',
        'ring-offset-background-dark': '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        heading: ['Montserrat', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 