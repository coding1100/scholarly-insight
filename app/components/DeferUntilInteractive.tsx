"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * Generic wrapper that renders its children only after the page
 * is fully interactive on the client (post-hydration / idle).
 *
 * Use this to wrap below-the-fold sections so that LCP is dominated
 * by the hero/above-the-fold content, especially on mobile.
 */
export default function DeferUntilInteractive({
  children,
  timeout = 3000,
}: {
  children: ReactNode;
  timeout?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const start = () => setReady(true);

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(start, { timeout });
    } else {
      // Fallback: schedule on next tick
      setTimeout(start, 0);
    }
  }, [timeout]);

  if (!ready) return null;
  return <>{children}</>;
}

