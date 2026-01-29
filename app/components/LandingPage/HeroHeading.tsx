import React from "react";

/**
 * Server-rendered LCP h1 so it appears in initial HTML and avoids
 * ~540ms element render delay from client hydration/font.
 */
interface HeroHeadingProps {
  mainHeading?: string | null;
}

export default function HeroHeading({ mainHeading }: HeroHeadingProps) {
  return (
    <h1 className="font-semibold text-[32px] md:text-[50px] leading-[1.1] text-black">
      {mainHeading ? (
        <span dangerouslySetInnerHTML={{ __html: mainHeading }} />
      ) : (
        <>
          Stop Sacrificing
          <br />
          Your Time, We&apos;ll
          <br />
          Handle Your
          <br />
          Classes
        </>
      )}
    </h1>
  );
}
