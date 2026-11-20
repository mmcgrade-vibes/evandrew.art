"use client";

import { site } from "@/content/site";
import styles from "./ContactForm.module.css";

/**
 * Opens the visitor's mail app with the message filled in. There is no server
 * behind this yet. Swap it for a scheduling embed or a form service when one
 * is chosen.
 */
export function ContactForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const subject = `Drawing lessons: ${data.get("name") || "new inquiry"}`;
        const body = `${data.get("message") || ""}\n\n${data.get("name") || ""}\n${data.get("email") || ""}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <label className={styles.field}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className={styles.field}>
        <span>Message</span>
        <textarea name="message" rows={3} required />
      </label>
      <button type="submit" className="button">Send</button>
    </form>
  );
}
