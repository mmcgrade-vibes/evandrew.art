"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Piece } from "@/content/work";
import { useLenis } from "./SmoothScroll";
import { TLink } from "./Transition";
import styles from "./PieceDetail.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Facts({ piece }: { piece: Piece }) {
  const rows: [string, string | undefined][] = [["Year", String(piece.year)], ["Medium", piece.medium], ["Size", piece.size], ["Client", piece.client]];
  return (
    <dl className={`t-mono-meta ${styles.facts}`}>
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

/**
 * Detail view. Pieces stack down the left and scroll, the text on the right
 * stays put and follows whichever piece is in view, and the row of thumbnails
 * works as a map of the page: pieces you have passed gather on the left,
 * pieces still to come wait on the right.
 */
export function PieceDetail({ items }: { items: Piece[] }) {
  const root = useRef<HTMLDivElement>(null);
  const figures = useRef<(HTMLElement | null)[]>([]);
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  useGSAP(() => {
    figures.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top 58%", end: "bottom 58%", onToggle: (self) => { if (self.isActive) setActive(i); } });
    });
  }, { scope: root, dependencies: [items] });

  const goTo = (i: number) => {
    const el = figures.current[i];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.145;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const piece = items[active];

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.stack}>
        {items.map((p, i) => (
          <figure
            key={p.slug}
            ref={(el) => { figures.current[i] = el; }}
            className={styles.figure}
            data-active={i === active}
            style={{ "--ar": p.width / p.height } as React.CSSProperties}
          >
            <div className={styles.frame} {...(i === 0 ? { "data-reveal": "0.1" } : {})}>
              <Image src={`/work/${p.slug}.jpg`} alt={`${p.title}, ${p.medium.toLowerCase()}, ${p.year}`} fill sizes="(max-width: 900px) 92vw, 52vw" loading={i < 2 ? "eager" : "lazy"} />
            </div>
            {/* Shown on small screens, where the side panel is not pinned. */}
            <figcaption className={styles.inlineCaption}>
              <p className="t-label">{p.title}</p>
              <p className="t-mono-meta">{p.description}</p>
              <Facts piece={p} />
            </figcaption>
          </figure>
        ))}
        <div className={styles.end}>
          <TLink href="/work" className="button">Back to all work</TLink>
        </div>
      </div>

      <aside className={styles.panel}>
        <div key={piece.slug} className={styles.text} aria-live="polite">
          <h1 className="t-label">{piece.title}</h1>
          <p className={`t-mono-meta ${styles.description}`}>{piece.description}</p>
          <Facts piece={piece} />
        </div>
        <TLink href="/work" className={`t-mono-label link ${styles.back}`}>All work</TLink>

        <div className={styles.thumbs} role="group" aria-label="Pieces on this page">
          {items.map((p, i) => (
            <Fragment key={p.slug}>
              <button
                type="button"
                className={styles.thumb}
                style={{ "--ar": p.width / p.height } as React.CSSProperties}
                data-active={i === active}
                aria-label={p.title}
                aria-current={i === active}
                onClick={() => goTo(i)}
              >
                <Image src={`/work/${p.slug}.jpg`} alt="" fill sizes="48px" />
              </button>
              {/* The gap opens after the piece in view and pushes the rest right. */}
              {i < items.length - 1 && <span className={styles.gap} data-open={i === active} />}
            </Fragment>
          ))}
        </div>
      </aside>
    </div>
  );
}
