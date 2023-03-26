/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nets-color": "#085474",
        "submit-color": "#007bc7",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
