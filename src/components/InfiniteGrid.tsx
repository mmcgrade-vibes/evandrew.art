"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Piece } from "@/content/work";
import { TLink } from "./Transition";
import { ViewToggle } from "./ViewToggle";
import styles from "./InfiniteGrid.module.css";

gsap.registerPlugin(useGSAP);

const COLS = 6;
const mod = (n: number, m: number) => ((n % m) + m) % m;

type Layout = { cell: number; cellH: number; rows: number; copiesX: number; copiesY: number };

/**
 * An endless wall of work. One block of tiles is repeated enough times to
 * cover the screen, and the whole plane is shifted by the pan position modulo
 * one block, so it never runs out in any direction. Pan with the wheel,
 * trackpad, drag or touch. A tap opens the piece.
 */
export function InfiniteGrid({ items }: { items: Piece[] }) {
  const root = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const rows = Math.ceil(items.length / COLS);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const cell = Math.round(vw < 700 ? vw * 0.46 : Math.max(250, vw * 0.21));
      const cellH = Math.round(cell * 1.16);
      // The layout depends on the window, which only exists in the browser.
      setLayout({ cell, cellH, rows, copiesX: Math.ceil(vw / (COLS * cell)) + 1, copiesY: Math.ceil(vh / (rows * cellH)) + 1 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [rows]);

  useGSAP(() => {
    if (!layout || !root.current || !plane.current || !scaler.current) return;
    const el = root.current;
    const blockW = COLS * layout.cell, blockH = layout.rows * layout.cellH;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: -layout.cell * 0.38, y: -layout.cellH * 0.22 };
    const target = { ...pos };
    let zoom = 1;
    let pointer: { id: number; x: number; y: number; t: number; vx: number; vy: number; travel: number } | null = null;

    const tick = () => {
      const dx = target.x - pos.x, dy = target.y - pos.y;
      const k = reduce ? 1 : 0.085;
      pos.x += dx * k;
      pos.y += dy * k;
      plane.current!.style.transform = `translate3d(${mod(pos.x, blockW) - blockW}px,${mod(pos.y, blockH) - blockH}px,0)`;
      // The wall eases back a touch while it is moving.
      const want = reduce ? 1 : 1 - Math.min(Math.hypot(dx, dy) / 9000, 0.07);
      zoom += (want - zoom) * 0.12;
      scaler.current!.style.transform = `scale(${zoom.toFixed(4)})`;
    };
    gsap.ticker.add(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : 1;
      target.x -= e.deltaX * unit;
      target.y -= e.deltaY * unit;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), vx: 0, vy: 0, travel: 0 };
      dragged.current = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      const now = performance.now(), dt = Math.max(now - pointer.t, 1);
      pointer.vx = pointer.vx * 0.6 + (dx / dt) * 0.4;
      pointer.vy = pointer.vy * 0.6 + (dy / dt) * 0.4;
      pointer.travel += Math.abs(dx) + Math.abs(dy);
      if (pointer.travel > 6) { dragged.current = true; el.dataset.dragging = "true"; }
      target.x += dx;
      target.y += dy;
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      if (dragged.current && performance.now() - pointer.t < 80) {
        // Throw: carry on in the direction of the drag.
        target.x += pointer.vx * 260;
        target.y += pointer.vy * 260;
      }
      pointer = null;
      delete el.dataset.dragging;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = layout.cell * 0.6;
      if (e.key === "ArrowLeft") target.x += step;
      else if (e.key === "ArrowRight") target.x -= step;
      else if (e.key === "ArrowUp") target.y += step;
      else if (e.key === "ArrowDown") target.y -= step;
      else return;
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, { dependencies: [layout] });

  const slots = Array.from({ length: COLS * rows }, (_, k) => items[k % items.length]);

  return (
    <section
      ref={root}
      className={styles.root}
      data-lenis-prevent
      aria-label="All work"
      // A drag must not count as a click on the tile under the pointer.
      onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}
    >
      <div ref={scaler} className={styles.scaler}>
        <div ref={plane} className={styles.plane}>
          {layout && Array.from({ length: layout.copiesX * layout.copiesY }, (_, c) => {
            const bx = c % layout.copiesX, by = Math.floor(c / layout.copiesX);
            return slots.map((p, k) => {
              const ar = p.width / p.height;
              const boxW = layout.cell * 0.74, boxH = layout.cellH * 0.74;
              const w = Math.round(Math.min(boxW, boxH * ar));
              const first = c === 0 && k < items.length;
              return (
                <TLink
                  key={`${c}-${k}`}
                  href={`/work/${p.slug}`}
                  className={styles.tile}
                  draggable={false}
                  tabIndex={first ? 0 : -1}
                  aria-hidden={!first}
                  aria-label={`${p.title}, ${p.year}`}
                  style={{ left: (bx * COLS + (k % COLS)) * layout.cell, top: (by * layout.rows + Math.floor(k / COLS)) * layout.cellH, width: layout.cell, height: layout.cellH }}
                >
                  <Image src={`/work/${p.slug}.jpg`} alt="" width={w} height={Math.round(w / ar)} sizes="(max-width: 700px) 36vw, 16vw" draggable={false} loading={c === 0 ? "eager" : "lazy"} />
                </TLink>
              );
            });
          })}
        </div>
      </div>
      <p className={`t-mono-label ${styles.hint}`}>Drag or scroll to explore</p>
      <div className={styles.toggle}><ViewToggle view="grid" /></div>
    </section>
  );
}
