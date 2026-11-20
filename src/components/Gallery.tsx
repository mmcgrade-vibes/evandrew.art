"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Piece } from "@/content/work";
import { useLenis } from "./SmoothScroll";
import { useTransitionNav } from "./Transition";
import { ViewToggle } from "./ViewToggle";
import styles from "./Gallery.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

// Share of each piece's scroll distance where it simply stays open. The move
// to the next piece happens in what is left.
const HOLD = 0.55;
// How quickly the strip catches up with the scroll position (0 to 1 per frame).
const FOLLOW = 0.11;

/** Turns even scroll progress into "rest on a piece, glide, rest on the next". */
const dwell = (p: number) => {
  const i = Math.floor(p);
  const t = gsap.utils.clamp(0, 1, (p - i - HOLD / 2) / (1 - HOLD));
  return i + t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Pinned gallery. Vertical scroll drives a horizontal strip: every piece is a
 * narrow, blurred slice until it reaches the centre, where it opens to its
 * full width. Each piece holds for a stretch of scrolling before the next
 * one takes over, and scrolling settles on the nearest piece. Clicking the open piece
 * goes to its detail page.
 */
export function Gallery({ items }: { items: Piece[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();
  const { navigate } = useTransitionNav();
  const lenisRef = useRef(lenis);
  useEffect(() => { lenisRef.current = lenis; }, [lenis]);
  const [active, setActive] = useState(0);
  const n = items.length;

  const scrollToIndex = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + (i / (n - 1)) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.2, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-piece]", track.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let height = 0, slice = 0, gap = 0, viewport = 0;
    let full: number[] = [];
    let current = -1;
    let idle: number | undefined;
    let goal = 0, shown = 0;

    const measure = () => {
      viewport = window.innerWidth;
      height = stage.current!.offsetHeight;
      const small = viewport < 700;
      slice = small ? 44 : Math.round(height * 0.393);
      gap = small ? 10 : 20;
      const maxFull = small ? viewport - 2 * (slice * 0.6 + gap) : viewport * 0.62;
      full = items.map((p) => Math.min(height * (p.width / p.height), maxFull));
    };

    const render = (p: number) => {
      let x = 0, focus = 0, weight = 0;
      for (let i = 0; i < els.length; i++) {
        const e = Math.max(0, 1 - Math.abs(i - p));
        const w = slice + (full[i] - slice) * e;
        const style = els[i].style;
        style.width = `${w}px`;
        style.transform = `translate3d(${x}px,0,0)`;
        style.opacity = String(0.5 + 0.5 * e);
        style.filter = reduce || e > 0.995 ? "none" : `blur(${(1 - e) * 10}px)`;
        focus += e * (x + w / 2);
        weight += e;
        x += w + gap;
      }
      track.current!.style.transform = `translate3d(${viewport / 2 - focus / (weight || 1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${n > 1 ? p / (n - 1) : 1})`;
      const nearest = Math.round(p);
      if (nearest !== current) { current = nearest; setActive(nearest); }
    };

    // The strip chases the scroll position instead of being locked to it, so
    // wheel steps and the settle below never show up as jumps.
    const follow = () => {
      const d = goal - shown;
      if (Math.abs(d) < 0.0004) { if (d !== 0) { shown = goal; render(shown); } return; }
      shown += d * (reduce ? 1 : FOLLOW);
      render(shown);
    };
    gsap.ticker.add(follow);

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onRefresh: (self) => { measure(); goal = shown = dwell(self.progress * (n - 1)); render(shown); },
      onUpdate: (self) => {
        goal = dwell(self.progress * (n - 1));
        // If scrolling stops part way between two pieces, finish the move.
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          if (!self.isActive) return;
          if (Math.abs(goal - Math.round(goal)) > 0.002) scrollToIndex(Math.round(self.progress * (n - 1)));
        }, 220);
      },
    });
    trigger.current = st;
    measure();
    goal = shown = dwell(st.progress * (n - 1));
    render(shown);

    return () => { gsap.ticker.remove(follow); window.clearTimeout(idle); trigger.current = null; };
  }, { scope: root, dependencies: [items] });

  const piece = items[active];

  return (
    <section ref={root} id="work" className={styles.root} style={{ "--count": n } as React.CSSProperties} aria-label="Selected work">
      <div className={styles.sticky}>
        <h2 className={`t-heading ${styles.title}`}>My work</h2>

        <div ref={stage} className={styles.stage}>
          <div ref={track} className={styles.track}>
            {items.map((p, i) => (
              <button key={p.slug} type="button" data-piece className={styles.piece} onClick={() => (i === active ? navigate(`/work/${p.slug}`) : scrollToIndex(i))} aria-label={i === active ? `${p.title}, ${p.year}. View details` : `${p.title}, ${p.year}`} aria-current={i === active}>
                <Image src={`/work/${p.slug}.jpg`} alt="" fill sizes="(max-width: 700px) 90vw, 62vw" loading={i < 3 ? "eager" : "lazy"} draggable={false} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <div key={piece.slug} className={styles.caption} aria-live="polite">
            <p className="t-label">{piece.title}</p>
            <p className={`t-mono-meta ${styles.meta}`}>{piece.year}, {piece.medium}</p>
          </div>
          <ViewToggle view="strip" />
          <div className={`t-label ${styles.counter}`}>
            <span className={styles.current}>{pad(active + 1)}</span>
            <span className={styles.rule}><span ref={bar} /></span>
            <span>{pad(n)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
