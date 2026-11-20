"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScroll";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const themeFor = (pathname: string) => (pathname === "/" ? "light" : pathname.startsWith("/work") ? "gallery" : "dark");
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Nav = { navigate: (href: string) => void };
const TransitionContext = createContext<Nav>({ navigate: () => {} });
export const useTransitionNav = () => useContext(TransitionContext);

/**
 * Page transitions: the outgoing page fades and lifts away, the route and
 * colour theme change while nothing is visible, then the new page settles in.
 * The header sits outside <main>, so it never moves.
 */
export function TransitionProvider({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const mainRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const failsafe = useRef<number | undefined>(undefined);
  const lenisRef = useRef(lenis);
  useEffect(() => { lenisRef.current = lenis; }, [lenis]);

  const scrollToTarget = useCallback((target: number | string, immediate: boolean) => {
    const l = lenisRef.current;
    if (l) {
      // The page height may have just changed, so Lenis has to re-measure
      // before it can scroll past the old page's limit.
      if (immediate) l.resize();
      return l.scrollTo(target, { immediate, force: true, duration: 1.2 });
    }
    if (typeof target === "number") return window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
    document.querySelector(target)?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }, []);

  const navigate = useCallback((href: string) => {
    if (busy.current) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) { window.location.href = href; return; }
    if (url.pathname === window.location.pathname) {
      scrollToTarget(url.hash || 0, false);
      return;
    }
    pendingHash.current = url.hash || null;
    const go = () => router.push(url.pathname + url.search, { scroll: false });
    const main = mainRef.current;
    if (!main || reducedMotion()) { go(); return; }

    busy.current = true;
    gsap.killTweensOf(main);
    gsap.to(main, { opacity: 0, y: -20, duration: 0.5, ease: "power2.inOut", onComplete: go });
    // If the route never arrives, don't leave the page blank.
    failsafe.current = window.setTimeout(() => {
      busy.current = false;
      gsap.to(main, { opacity: 1, y: 0, duration: 0.4, clearProps: "transform" });
    }, 6000);
  }, [router, scrollToTarget]);

  // Runs on first load and after every route change.
  useIsoLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    window.clearTimeout(failsafe.current);
    document.documentElement.dataset.theme = themeFor(pathname);

    const hash = pendingHash.current ?? (window.location.hash || null);
    pendingHash.current = null;
    scrollToTarget(0, true);

    if (reducedMotion()) {
      gsap.set(main, { clearProps: "transform", opacity: 1 });
      busy.current = false;
      if (hash) requestAnimationFrame(() => scrollToTarget(hash, true));
      return;
    }

    let ctx: gsap.Context | undefined;
    // wipe = first view after the load screen: content rises into place from
    // behind a bottom edge. Otherwise a soft fade, used between pages.
    const enter = (wipe: boolean) => {
      ctx = gsap.context(() => {
        gsap.fromTo(main, { opacity: wipe ? 1 : 0, y: wipe ? 0 : 24 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.05, clearProps: "transform",
          onComplete: () => { busy.current = false; ScrollTrigger.refresh(); },
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const delay = Number(el.dataset.reveal || 0);
          const scrollTrigger = { trigger: el, start: "top 92%", once: true };
          if (wipe) {
            gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)", y: 70 }, {
              clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.3, ease: "power4.out",
              delay: 0.25 + delay * 1.4, clearProps: "clipPath,transform", scrollTrigger,
            });
          } else {
            gsap.from(el, { opacity: 0, y: 32, duration: 1.1, ease: "power3.out", delay, scrollTrigger });
          }
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax || -8), ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }, main);
    };

    // On a fresh page load, wait for the load screen to start lifting.
    const root = document.documentElement;
    const waiting = root.dataset.js === "1" && root.dataset.loaded !== "1";
    const onLoaded = () => enter(true);
    if (waiting) window.addEventListener("loader:done", onLoaded, { once: true });
    else enter(false);

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (hash) scrollToTarget(hash, true);
    });

    return () => { window.removeEventListener("loader:done", onLoaded); cancelAnimationFrame(raf); ctx?.revert(); };
  }, [pathname, scrollToTarget]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {header}
      <main ref={mainRef} id="main">{children}</main>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** A next/link that runs the page transition before navigating. */
export function TLink({ href, onClick, children, ...rest }: TLinkProps) {
  const { navigate } = useTransitionNav();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
