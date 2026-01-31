"use client";
import React, { FC, ReactNode, Children } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import AppNav from "./components/LandingPage/Header";
import Footer from "./components/Footer/Footer";
import DelayedBelowFold from "./components/LandingPage/DelayedBelowFold";

// Lazy load auth provider
const AuthProvider = dynamic(() => import("./context/auth/AuthProvider"), {
  ssr: false,
});

const CookieBanner = dynamic(() => import("./components/CookieConsent"), {
  ssr: false,
});

const WhatsApp = dynamic(() => import("./components/WhatsApp/WhatsApp"), {
  ssr: false,
});

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    '/take-my-class',
    '/take-my-class/',
    '/take-my-class-1',
    '/take-my-class-1/',
    '/take-my-class-2',
    '/take-my-class-2/',
    '/take-my-exam',
    '/take-my-exam/',
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(pathname || '');

  // Split children to isolate the Hero section (assumed to be the first child)
  const childrenArray = Children.toArray(children);
  const hero = childrenArray[0];
  const rest = childrenArray.slice(1);

  return (
    <AuthProvider>
      {/* Defer Header - Only Hero section should be visible initially */}
      {!shouldHideHeaderFooter && (
        <DelayedBelowFold delay={2000}>
          <AppNav />
        </DelayedBelowFold>
      )}

      {/* The Hero section (first child) renders immediately */}
      {hero}

      {/* Everything else is deferred for 2 seconds */}
      <DelayedBelowFold delay={2000}>
        {rest}
        {!shouldHideHeaderFooter && <Footer />}
        <WhatsApp />
        <CookieBanner />
      </DelayedBelowFold>
    </AuthProvider>
  );
};

export default MainLayout;
