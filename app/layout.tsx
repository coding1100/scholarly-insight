import { Poppins } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import { Metadata } from "next";

const ClientScripts = dynamic(() => import("./components/ClientScripts"), {
  ssr: false,
});

// Optimize font loading - next/font self-hosts fonts (NO CDN calls)
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Scholarly Help - Academic Writing Services For You",
  description: "Professional academic writing services tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Force HTTPS for all resources in production only */}
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        )}

      </head>
      <body suppressHydrationWarning={true}>
        <main id="main-content">{children}</main>

        {/* GTM - Optimized loading strategy: user interaction > idle > fallback timeout */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var gtmLoaded = false;
                
                function initGTM() {
                  if (gtmLoaded) return;
                  gtmLoaded = true;
                  
                  // Add DNS prefetch inline to reduce overhead
                  var link = document.createElement('link');
                  link.rel = 'dns-prefetch';
                  link.href = 'https://www.googletagmanager.com';
                  document.head.appendChild(link);
                  
                  // Load GTM
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5ZHV46X');
                }
                
                // Priority 1: Load immediately on user interaction
                var events = ['scroll', 'mousedown', 'touchstart', 'keydown'];
                var handleInteraction = function() {
                  initGTM();
                  events.forEach(e => window.removeEventListener(e, handleInteraction));
                };
                events.forEach(e => window.addEventListener(e, handleInteraction, { once: true, passive: true }));
                
                // Priority 2: Load on idle (after page is fully loaded)
                if (document.readyState === 'complete') {
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(initGTM, { timeout: 4000 });
                  } else {
                    setTimeout(initGTM, 3000);
                  }
                } else {
                  window.addEventListener('load', function() {
                    if ('requestIdleCallback' in window) {
                      requestIdleCallback(initGTM, { timeout: 4000 });
                    } else {
                      setTimeout(initGTM, 3000);
                    }
                  }, { once: true });
                }
              })();
            `,
          }}
        />


        {/* Client-side scripts that need pathname */}
        <ClientScripts />
      </body>
    </html>
  );
}
