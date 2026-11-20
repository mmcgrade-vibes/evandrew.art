import type { Metadata } from "next";
import { contact } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "Book a lesson" };

export default function Contact() {
  return (
    <section className={`${styles.page} ${styles.single}`}>
      <div className={`${styles.copy} ${styles.wide}`}>
        <h1 className="t-heading" data-reveal="0.15">{contact.heading}</h1>
        <div className="t-body" data-reveal="0.23">
          {contact.body.map((p) => <p key={p}>{p}</p>)}
          <p className={styles.hours}>
            {contact.hours.map((h) => <span key={h} style={{ display: "block" }}>{h}</span>)}
          </p>
        </div>
        <div className={`t-body ${styles.form}`} data-reveal="0.31">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
