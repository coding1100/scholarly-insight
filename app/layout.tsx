import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Metadata } from "next";
import ClientScripts from "./components/ClientScripts";

// Optimize font loading - next/font self-hosts fonts (NO CDN calls)
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  preload: true,
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

        {/* CRITICAL: Preload LCP image to eliminate resource load delay */}
        <link
          rel="preload"
          as="image"
          href="/images/Hero-Group-195.webp"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/_next/image?url=%2Fimages%2FHero-Group-195.webp&w=640&q=75 1x, /_next/image?url=%2Fimages%2FHero-Group-195.webp&w=1080&q=75 2x"
          imageSizes="(max-width: 1025px) 0px, 450px"
        />


     
        
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <main id="main-content">{children}</main>

        {/* 
         * PERFORMANCE: All scripts use lazyOnload to minimize main thread work
         * This defers all non-critical scripts until after page is fully interactive
         */}

        

        
        {/* Client-side scripts that need pathname */}
        <ClientScripts />
      </body>
    </html>
  );
}
