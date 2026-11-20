"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * A 24px icon drawn from a Lottie JSON file. It sits still on its first frame
 * and plays once each time the nearest link or button is hovered or focused.
 * Swap the JSON in src/icons to change the artwork or the motion.
 */
export function LottieIcon({ data, size = 24 }: { data: object; size?: number }) {
  const holder = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const host = el.closest("a, button") ?? el;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anim: AnimationItem | undefined;
    let cancelled = false;

    // The player is only fetched in the browser, after the page has loaded.
    import("lottie-web/build/player/lottie_light").then(({ default: lottie }) => {
      if (cancelled) return;
      anim = lottie.loadAnimation({ container: el, renderer: "svg", loop: false, autoplay: false, animationData: data });
    });

    const play = () => { if (!reduce) anim?.goToAndPlay(0, true); };
    host.addEventListener("pointerenter", play);
    host.addEventListener("focus", play);
    return () => {
      cancelled = true;
      host.removeEventListener("pointerenter", play);
      host.removeEventListener("focus", play);
      anim?.destroy();
    };
  }, [data]);

  return <span ref={holder} aria-hidden="true" style={{ display: "block", width: size, height: size }} />;
}
