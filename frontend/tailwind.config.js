/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lumina: {
                    dark: '#121212',
                    black: '#000000',
                    bg: '#FDFCF9',
                    blue: {
                        bg: '#B6CAEB',
                        text: '#8AA2C8',
                        border: '#8AA2C8',
                    },
                    pink: {
                        bg: '#F5B8DA',
                        text: '#E09CC3',
                        border: '#E09CC3',
                    },
                    yellow: {
                        bg: '#F7D768',
                        text: '#E8C84D',
                        border: '#E8C84D',
                    },
                    green: {
                        bg: '#9AAB63',
                        text: '#808E53',
                        border: '#808E53',
                    }
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
