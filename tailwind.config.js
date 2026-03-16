/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1150px",
      xl: "1280px",
      "2xl": "1536px",
    },

    extend: {
      // Page 36: use structured variation within one family for consistency
      // Page 40: typography should function as a scalable system
      fontFamily: {
        sans: ['"Urbanist"', "sans-serif"],
        display: ['"Urbanist"', "sans-serif"],
      },

      // Page 11: size and weight establish hierarchy
      // Page 12-13: clean typography, balanced line lengths, generous spacing
      // Page 14: text that is too small or tightly spaced reduces comfort
      // Note: the PDF gives principles, not exact numeric sizes.
      // These sizes are my recommended implementation based on those principles.
      fontSize: {
        xs: [
          "0.75rem", // 12px - better minimum readable UI text (Page 14)
          {
            lineHeight: "1rem",
            letterSpacing: "0.01em",
          },
        ],
        sm: [
          "0.875rem", // 14px - helper text / small labels (Page 13)
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.01em",
          },
        ],
        base: [
          "1rem", // 16px - primary body text for readability
          {
            lineHeight: "1.6",
            letterSpacing: "0",
          },
        ],
        lg: [
          "1.125rem", // 18px - emphasized body / intro text
          {
            lineHeight: "1.6",
            letterSpacing: "0",
          },
        ],
        xl: [
          "1.25rem", // 20px - card titles / small section headings
          {
            lineHeight: "1.4",
            letterSpacing: "-0.01em",
          },
        ],
        "2xl": [
          "1.5rem", // 24px - section headings
          {
            lineHeight: "1.4",
            letterSpacing: "-0.015em",
          },
        ],
        "3xl": [
          "1.875rem", // 30px - sub-section title
          {
            lineHeight: "1.25",
            letterSpacing: "-0.02em",
          },
        ],
        "4xl": [
          "2.25rem", // 36px - section title
          {
            lineHeight: "1.2",
            letterSpacing: "-0.025em",
          },
        ],
        "5xl": [
          "3rem", // 48px - desktop hero headline start (Pages 11, 13)
          {
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
          },
        ],
        "6xl": [
          "3.75rem", // 60px - large hero headline (Pages 11, 13)
          {
            lineHeight: "1.05",
            letterSpacing: "-0.035em",
          },
        ],
        "7xl": [
          "4.5rem", // 72px - very large campaign/hero use only (Page 33 says display sizes should be used sparingly)
          {
            lineHeight: "1",
            letterSpacing: "-0.04em",
          },
        ],
        "8xl": [
          "6rem", // 96px - special marketing-only display use (Page 33)
          {
            lineHeight: "1",
            letterSpacing: "-0.05em",
          },
        ],
      },

      // Page 36-38: family-based variation and structured hierarchy through weights
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },

    colors: {
      transparent: "transparent",
      current: "currentColor",
      lightwhite: "#F9F9F9",
      white: "#ffffff",
      black: "#111827",
      blue: "#0066FF",
      lightblue: "#d9e8ff",
      darkpurple: "#241A24",
      lightgrey: "#F4F5F6",
      navyblue: "#00224A",
      darkblue: "#1E013A",
      offwhite: "rgba(255, 255, 255, 0.75)",
      lightblack: "rgba(0, 0, 0, 0.55)",
      bluish: "rgba(14, 13, 13, 0.75)",
      testColor: "rgba(54, 54, 54, 0.75)",
      grey: "#909090",
      bgblue: "#02398A",
      darkgrey: "#747474",
      faqblue: "#0861FF",
      gold: "#FAAF38",
      hoblue: "#0000FF",
      btnblue: "#267dff",
      bggrey: "#DDDDDD",
      footer: "rgba(226, 223, 223, 0.75)",
      linegrey: "#C4C4C4",
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
    },
  },
  plugins: [require("flowbite-typography"), require("flowbite/plugin")],
};
