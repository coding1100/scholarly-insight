import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // Comprehensive content paths for better CSS purging - scan all relevant files
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Include HTML files if any
    "./public/**/*.html",
  ],
  // Only safelist classes that are ACTUALLY dynamically generated
  safelist: [
    'animate-pulse',
    'bg-gray-100',
  ],
  // Blocklist unused Tailwind utilities to reduce CSS bundle
  blocklist: [
    // Remove unused dark mode variants if not using dark mode on landing page
    'dark',
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      mid: "827px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      // Override default font family to prevent Inter loading
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        sample: "url('/Image/sampleBg.webp')",
        heroImage: "url('/Image/bgHeroBoyGirl.webp')",
      },
      colors: {
        primary: {
          100: "#F7F7FD",
          200: "#ECECFB",
          300: "#D1D1F7",
          400: "#565add",
          500: "#2B1C50",
          600: "#212529",
        },
        secondary: {
          200: "#F2E0C7",
          400: "#f97316",
          500: "#ff641a",
        },
      },
    },
  },
  // Disable unused core plugins to reduce CSS bundle size
  corePlugins: {
    /* REQUIRED */
    preflight: true,
    container: true,
  
    /* Layout */
    display: true,
    position: true,
    inset: true,
    zIndex: true,
    overflow: true,
  
    /* Spacing */
    margin: true,
    padding: true,
  
    /* Sizing */
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
  
    /* Flex only (no grid) */
    flex: true,
    flexDirection: true,
    alignItems: true,
    justifyContent: true,
    gap: true,
    gridTemplateColumns: true,
  
    /* Typography (minimum) */
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    lineHeight: true,
    textAlign: true,
    textColor: true,
    letterSpacing: true,
    textTransform: true,
  
    /* Visuals */
    backgroundColor: true,
    borderWidth: true,
    borderColor: true,
    borderRadius: true,
    boxShadow: true,
    opacity: true,
  
    /* Interaction */
    cursor: true,
    pointerEvents: true,
    userSelect: false,
  
  
    /* Kill everything fancy */
    aspectRatio: false,
    filter: false,
    backdropBlur: true,
    blur: true,
    brightness: false,
    contrast: false,
    grayscale: true,
    hueRotate: false,
    invert: true,
    saturate: false,
    sepia: false,
    mixBlendMode: false,
    isolation: false,
  
    /* UX extras */
    scrollSnapAlign: true,
    scrollSnapStop: false,
    scrollSnapType: true,
    touchAction: false,
    willChange: false,
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
