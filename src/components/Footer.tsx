import { site, home } from "@/content/site";
import { TLink } from "./Transition";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`t-mono-data ${styles.row}`}>
        <div className={styles.group} data-reveal="0">
          <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
          {site.phone && <a className="link" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>}
        </div>
        <div className={styles.group} data-reveal="0.08">
          {site.socials.map((s) => (
            <a key={s.href} className="link" href={s.href} target="_blank" rel="noreferrer" style={{ textTransform: "uppercase" }}>{s.label}</a>
          ))}
        </div>
        <div className={styles.cta} data-reveal="0.16">
          <TLink href="/contact" className="button">{home.cta}</TLink>
        </div>
      </div>
      <p className={styles.name} aria-hidden="true" data-reveal="0.1">{site.name}</p>
    </footer>
  );
}
