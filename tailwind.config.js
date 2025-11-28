/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                casino: {
                    green: '#0f382a',
                    dark: '#051a12',
                    gold: '#d4af37',
                    goldLight: '#f3e5ab',
                    red: '#a61e1e',
                }
            },
            backgroundImage: {
                'felt': 'radial-gradient(circle at center, #1a4d3a 0%, #051a12 100%)',
            }
        },
    },
    plugins: [],
}
