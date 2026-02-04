/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary backgrounds
                'bg-primary': '#0a0a0a',
                'bg-secondary': '#141414',
                'bg-tertiary': '#1a1a1a',
                // Accent colors
                'accent-green': '#00ff88',
                'accent-red': '#ff3366',
                'accent-blue': '#00d4ff',
                'accent-yellow': '#ffcc00',
                // Text colors
                'text-primary': '#ffffff',
                'text-secondary': '#a0a0a0',
                // Border
                'border-color': '#2a2a2a',
            },
            fontFamily: {
                'archivo': ['Archivo', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 0 20px 10px rgba(0, 212, 255, 0)' },
                },
            },
        },
    },
    plugins: [],
}
