/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#15171C",
        panel: "#20232B",
        borderDark: "#343741",
        accent: {
          DEFAULT: "#D4B06A",
          hover: "#C29F59",
          muted: "rgba(212, 176, 106, 0.15)",
        },
        mainText: "#E8E8E8",
        subText: "#9CA3AF",
        correct: {
          DEFAULT: "#7DBE9A",
          muted: "rgba(125, 190, 154, 0.15)",
        },
        incorrect: {
          DEFAULT: "#D98282",
          muted: "rgba(217, 130, 130, 0.15)",
        },
      },
    },
  },
  plugins: [],
};
