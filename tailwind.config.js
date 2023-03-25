/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#085474",
        submit: "#007bc7",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
