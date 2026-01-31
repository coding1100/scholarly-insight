"use client";

import { ReactNode, useEffect, useState } from "react";

type DeferUntilInteractiveProps = {
  children: ReactNode;
};

/**
 * Generic wrapper that renders its children only after the page
 * is interactive on the client (post-hydration, when the main
 * thread is idle or after a short timeout).
 *
 * Good for deferring below-the-fold or non-critical sections
 * to improve mobile LCP and initial CSS/JS cost.
 */
export default function DeferUntilInteractive({
  children,
}: DeferUntilInteractiveProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Force a 2-second delay to ensure the Hero section is the only focus for LCP
    const timer = setTimeout(() => {
      setReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

