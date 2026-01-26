"use client";

import { useEffect } from "react";

let slickCSSLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Dynamically loads slick-carousel CSS only when needed
 * This prevents it from being included in the critical CSS bundle
 * and improves web vitals by deferring non-critical CSS
 * 
 * Uses webpack's dynamic import to code-split the CSS
 */
export function useSlickCSS() {
  useEffect(() => {
    // Only load once, even if multiple components use it
    if (slickCSSLoaded || typeof window === "undefined") return;

    // Check if slick CSS is already in the document
    const existingLink = document.querySelector(
      'link[href*="slick"]'
    );
    if (existingLink) {
      slickCSSLoaded = true;
      return;
    }

    // Use a promise to prevent multiple simultaneous loads
    if (!loadingPromise) {
      loadingPromise = import("slick-carousel/slick/slick.css").then(() => {
        slickCSSLoaded = true;
        loadingPromise = null;
      }).catch(() => {
        loadingPromise = null;
      });
    }

    return () => {
      // Don't remove the CSS on unmount - other components might need it
      // The CSS will be cached by the browser anyway
    };
  }, []);
}
