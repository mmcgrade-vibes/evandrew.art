"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { TLink } from "./Transition";
import { useLenis } from "./SmoothScroll";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeline.current = gsap
      .timeline({ paused: true, defaults: { ease: "power3.out" } })
      .set(overlay.current, { visibility: "visible" })
      .fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.5, ease: "power2.out" })
      .fromTo("[data-menu-item]", { opacity: 0, y: reduce ? 0 : 28 }, { opacity: 1, y: 0, duration: reduce ? 0 : 0.8, stagger: 0.07 }, reduce ? 0 : 0.1);
  }, { scope: overlay });

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (open) { lenis?.stop(); tl.timeScale(1).play(); }
    else { lenis?.start(); tl.timeScale(1.6).reverse(); }
  }, [open, lenis]);

  // Close when the route changes (covers the browser back button too).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={styles.header}>
        <TLink href="/" className={styles.wordmark} onClick={() => setOpen(false)}>{site.name}</TLink>
        <button ref={toggle} type="button" className={`t-mono-label ${styles.toggle}`} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
          <span className={styles.toggleClip}>
            <span className={styles.toggleInner} data-open={open}>
              <span aria-hidden={open}>Menu</span>
              <span aria-hidden={!open}>Close</span>
            </span>
          </span>
        </button>
      </header>

      <div ref={overlay} id="menu" className={styles.overlay} inert={!open} data-lenis-prevent>
        <nav className={styles.nav} aria-label="Main">
          {site.nav.map((item) => (
            <TLink key={item.href} href={item.href} className={styles.navLink} data-menu-item onClick={() => setOpen(false)}>
              {item.label}
            </TLink>
          ))}
        </nav>
        <div className={`t-mono-data ${styles.contact}`}>
          <div className={styles.contactGroup} data-menu-item>
            <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
            {site.phone && <a className="link" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>}
          </div>
          <div className={styles.contactGroup} data-menu-item>
            {site.socials.map((s) => (
              <a key={s.href} className="link" href={s.href} target="_blank" rel="noreferrer" style={{ textTransform: "uppercase" }}>{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
