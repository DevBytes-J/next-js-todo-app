// postcss.config.js (Updated)

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // 🚨 CRITICAL: The Tailwind v4 equivalent of the 'content' array
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./public/**/*.html",
      ],
    },
    autoprefixer: {},
  },
};

export default config;
