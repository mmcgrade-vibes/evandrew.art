import Image from "next/image";
import { home } from "@/content/site";
import { work } from "@/content/work";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { TLink } from "@/components/Transition";
import styles from "./home.module.css";

export default function Home() {
  // Stand-in picture. TODO: replace with a photo of Evan teaching once he supplies one.
  const hero = work.find((p) => p.slug === "sweden")!;
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.figure} data-reveal="0.1">
          <Image src={`/work/${hero.slug}.jpg`} alt={`${hero.title}, a drawing by Evan Drew`} fill sizes="(max-width: 900px) 90vw, 440px" loading="eager" fetchPriority="high" data-parallax="-8" />
        </div>
        <div className={styles.copy}>
          <h1 className="t-heading" data-reveal="0.2">{home.heading}</h1>
          <p className="t-body" data-reveal="0.28">{home.body}</p>
          <div className={styles.cta} data-reveal="0.36">
            <TLink href="/contact" className="button">{home.cta}</TLink>
          </div>
        </div>
      </section>
      <Gallery items={work} />
      <Footer />
    </>
  );
}
