"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { site } from "@/content/site";
import { useLenis } from "./SmoothScroll";
import styles from "./Loader.module.css";

type Item = { slug: string; width: number; height: number };

// The load screen stays up at least this long, so it never just flashes.
const MIN_SECONDS = 1.8;
// How long each piece shows while cycling.
const CYCLE_SECONDS = 0.16;

/**
 * Full-screen load screen shown on every fresh page load. Pieces cycle in the
 * centre while the percentage follows real progress (the cycling images, the
 * fonts and the page itself). At 100% it lifts away and tells the page to
 * bring its content in. Hidden entirely without JavaScript or when the
 * visitor asks for reduced motion.
 */
export function Loader({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && document.documentElement.dataset.loaded !== "1" && document.documentElement.dataset.js === "1") lenis.stop();
  }, [lenis]);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el) return;
    const finish = () => { html.dataset.loaded = "1"; window.dispatchEvent(new Event("loader:done")); };
    if (html.dataset.js !== "1") { finish(); return; }

    const frames = Array.from(el.querySelectorAll<HTMLElement>("[data-frame]"));
    const imgs = frames.map((f) => f.querySelector("img")).filter(Boolean) as HTMLImageElement[];
    const total = imgs.length + 2;
    let done = 0;
    const step = () => { done = Math.min(done + 1, total); };
    imgs.forEach((img) => {
      if (img.complete) step();
      else { img.addEventListener("load", step, { once: true }); img.addEventListener("error", step, { once: true }); }
    });
    document.fonts.ready.then(step, step);
    if (document.readyState === "complete") step(); else window.addEventListener("load", step, { once: true });
    // Never hold the page hostage to one slow file.
    const giveUp = window.setTimeout(() => { done = total; }, 8000);

    let frame = 0;
    const cycle = window.setInterval(() => {
      frames[frame].dataset.on = "false";
      frame = (frame + 1) % frames.length;
      frames[frame].dataset.on = "true";
    }, CYCLE_SECONDS * 1000);

    const started = performance.now();
    let shown = 0, leaving = false;
    const tick = () => {
      const byTime = Math.min((performance.now() - started) / (MIN_SECONDS * 1000), 1);
      const target = Math.min(done / total, byTime) * 100;
      shown += (target - shown) * 0.12;
      if (target === 100 && shown > 99.4) shown = 100;
      if (count.current) count.current.textContent = String(Math.round(shown));
      if (shown === 100 && !leaving) {
        leaving = true;
        window.clearInterval(cycle);
        gsap.timeline({ delay: 0.25 })
          .to(el.querySelectorAll("[data-part]"), { yPercent: -60, opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.05 })
          .add(() => { finish(); lenisRef.current?.start(); }, 0.35)
          // The screen lifts from the bottom edge upward.
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "power4.inOut" }, 0.35)
          .set(el, { display: "none" });
        gsap.ticker.remove(tick);
      }
    };
    gsap.ticker.add(tick);

    return () => { gsap.ticker.remove(tick); window.clearInterval(cycle); window.clearTimeout(giveUp); };
  }, []);

  return (
    <div ref={root} className={styles.loader} aria-hidden="true">
      <div className={styles.row}>
        <p className={`t-heading ${styles.name}`} data-part>{site.name}</p>
        <div className={styles.frame} data-part>
          {items.map((p, i) => (
            <div key={p.slug} data-frame data-on={i === 0}>
              <Image src={`/work/${p.slug}.jpg`} alt="" fill sizes="200px" loading="eager" />
            </div>
          ))}
        </div>
        <p className={`t-mono-data ${styles.count}`} data-part><span ref={count}>0</span>%</p>
      </div>
    </div>
  );
}
