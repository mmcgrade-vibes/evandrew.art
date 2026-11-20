// Site-wide content. Edit here, not in components.
export const site = {
  name: "Evan Drew",
  title: "Evan Drew | Private drawing lessons in Kansas City and Lawrence",
  description:
    "Private drawing lessons for students 16 and up. Ten weeks of observation, drafting and composition, taught one-on-one across Lawrence and the Kansas City metro.",
  // TODO: confirm with Evan. This is the address on the current site.
  email: "evan.mcminn@signaltheory.com",
  // TODO: add a phone number if Evan wants one shown. Leave empty to hide it.
  phone: "",
  socials: [{ label: "Instagram", href: "https://www.instagram.com/_evan_drew/" }],
  nav: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/#work" },
    { label: "Book a lesson", href: "/contact" },
  ],
};

export const home = {
  heading: "Learn to draw",
  body: "Private drawing lessons for students 16 and up. Ten weeks of observation, drafting and composition, taught one-on-one across Lawrence and the Kansas City metro. Your first session is free.",
  cta: "Book a lesson",
};

export const about = {
  heading: "About me",
  body: [
    "Many people look at the world, but few really notice it. Drawing is the ability to see relationships and to describe them with skill, and it is the foundation of all visual communication.",
    "I hold a BFA in animation from the Kansas City Art Institute and trained at the Barnstone Studios atelier. I teach to pass on an interest in the artisan trades.",
  ],
};

export const contact = {
  heading: "Get in touch",
  body: [
    "Tell me a little about yourself and when you are free, and I’ll confirm a time and place with you, usually the same day. Your first session is free. After that, sessions are $60 each.",
  ],
  hours: ["Monday and Friday, 6 to 9pm", "Saturday and Sunday, 9am to 12pm and 4 to 8pm"],
};
