import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // Scan all files that render on "/" and listed (pages) routes so their Tailwind classes are in the bundle.
  // (pages) + components globs cover: contact-us, take-my-class, tools, ai-*, guarantee pages, order, scan, thank-you, auth, etc.
  content: [
    "./app/page.tsx",
    "./app/layout.tsx",
    "./app/MainLayout.tsx",
    "./app/(pages)/**/*.{tsx,jsx}",
    "./app/components/**/*.{tsx,jsx}",
    "./app/context/**/*.tsx",
    "./app/(admin)/**/*.tsx",
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
  // Only disable plugins with ZERO usage in app/ (keeps bundle small, UI intact)
  corePlugins: {
    preflight: true,
    container: true,
    display: true,
    position: true,
    inset: true,
    zIndex: true,
    overflow: true,
    margin: true,
    padding: true,
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
    flex: true,
    flexDirection: true,
    alignItems: true,
    justifyContent: true,
    gap: true,
    gridTemplateColumns: true,
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    lineHeight: true,
    textAlign: true,
    textColor: true,
    letterSpacing: true,
    textTransform: true,
    backgroundColor: true,
    borderWidth: true,
    borderColor: true,
    borderRadius: true,
    boxShadow: true,
    opacity: true,
    cursor: true,
    pointerEvents: true,
    userSelect: false,
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
    scrollSnapAlign: true,
    scrollSnapStop: false,
    scrollSnapType: true,
    touchAction: false,
    willChange: false,
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
