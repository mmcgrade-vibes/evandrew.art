import type { Metadata } from "next";
import { about } from "@/content/site";
import { TLink } from "@/components/Transition";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className={styles.page}>
      {/* TODO: replace with a photo of Evan once he supplies one. */}
      <div className={styles.figure} data-reveal="0.1">
        <span className={`t-mono-label ${styles.placeholder}`}>Photo of Evan to come</span>
      </div>
      <div className={styles.copy}>
        <h1 className="t-heading" data-reveal="0.2">{about.heading}</h1>
        <div className="t-body" data-reveal="0.28">
          {about.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div style={{ marginTop: 27 }} data-reveal="0.36">
          <TLink href="/contact" className="button">Book a lesson</TLink>
        </div>
      </div>
    </section>
  );
}
