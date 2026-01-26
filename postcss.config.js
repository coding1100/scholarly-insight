module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Only run PurgeCSS and cssnano in production to speed up development
    // IMPORTANT: Tailwind CSS v3+ already purges unused CSS automatically via JIT mode.
    // PurgeCSS here provides additional optimization for:
    // 1. Custom CSS in globals.css
    // 2. Third-party CSS (like slick-carousel if imported statically)
    // 3. Any CSS that Tailwind doesn't handle
    // Using styles.pure.css as reference for what CSS is actually used.
    ...(process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './app/**/*.{js,jsx,ts,tsx,mdx}',
          './components/**/*.{js,jsx,ts,tsx,mdx}',
          './pages/**/*.{js,jsx,ts,tsx,mdx}',
          './src/**/*.{js,jsx,ts,tsx,mdx}',
        ],
        // Minimal safelist - only keep what's absolutely necessary
        // Be aggressive to remove unused CSS and match styles.pure.css optimization
        safelist: {
          // Only keep slick-carousel classes that are dynamically loaded
          standard: [
            /^slick-/,
            /^slick$/,
            // Keep only specific custom classes that are used
            /^carousel-card$/,
            /^center-card$/,
            /^samplesSlider$/,
            /^sampleCard$/,
            /^samplesWrap$/,
            /^customerReviewsWrap$/,
            /^customerReviewsCard$/,
            /^testimonials$/,
            // Keep custom utility classes from globals.css
            /^no-scrollbar$/,
            /^formtwo$/,
            /^lineAdded$/,
            /^will-change-scroll$/,
            /^animate-fade-in$/,
            /^animate-fade-in-up$/,
            /^animate-slide-in-left$/,
            /^animate-slide-in-right$/,
          ],
          // Keep classes with these patterns (but be specific)
          deep: [
            /^slick-/,
            /slick$/,
          ],
          // Keep keyframes, media queries, and other at-rules
          greedy: [
            /^@keyframes/,
            /^@media/,
            /^@font-face/,
            /^@layer/,
          ],
        },
        // Enhanced extractor to match Tailwind's class detection
        defaultExtractor: (content) => {
          // Extract class names from className attributes (JSX/TSX)
          const classNameMatches = content.match(/className=["'`]([^"'`]+)["'`]/g) || [];
          const classNameExtracted = classNameMatches
            .map(match => {
              const classes = match.replace(/className=["'`]|["'`]/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Extract classes from template literals with className
          const templateMatches = content.match(/className=\{`([^`]+)`\}/g) || [];
          const templateExtracted = templateMatches
            .map(match => {
              const classes = match.replace(/className=\{`|`\}/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Extract classes from class attributes (HTML)
          const classMatches = content.match(/class=["']([^"']+)["']/g) || [];
          const classExtracted = classMatches
            .map(match => {
              const classes = match.replace(/class=["']|["']/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Combine all extracted classes and remove duplicates
          const allClasses = [
            ...classNameExtracted,
            ...templateExtracted,
            ...classExtracted,
          ];
          
          // Return unique classes
          return [...new Set(allClasses)].filter(Boolean);
        },
        // Don't purge CSS variables, keyframes, or font-face
        variables: true,
        keyframes: true,
        fontFace: true,
      },
      // Add cssnano for CSS minification and optimization
      // This runs AFTER PurgeCSS to minify the final CSS
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifySelectors: true,
          // Remove unused CSS rules
          reduceIdents: false, // Keep animation names
          zindex: false, // Don't optimize z-index values
          // Aggressive optimization
          discardUnused: true, // Remove unused @rules
          mergeRules: true, // Merge duplicate rules
          normalizeUrl: true, // Normalize URLs
        }],
      },
    } : {}),
  },
};
