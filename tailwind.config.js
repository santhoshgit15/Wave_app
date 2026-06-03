/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        waveBg: {
          light: '#F4F1EA',
          dark: '#111111',
        },
        waveSurface: {
          light: '#E8E4DD',
          dark: '#1A1A1A',
        },
        waveBorder: {
          light: '#D8D4CD',
          dark: '#2A2A2A',
        },
        waveText: {
          light: '#1D1D1D',
          dark: '#EAEAEA',
        },
        waveAccent: {
          light: '#D84B36',
          dark: '#FF5D45',
        }
      }
    },
  },
  plugins: [],
}
