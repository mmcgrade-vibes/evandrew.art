import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";
import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { work } from "@/content/work";

export const metadata: Metadata = {
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
};

export const viewport: Viewport = { themeColor: "#e2e3de" };

// Sets the page theme before first paint so dark pages don't flash light.
const themeScript = `(function(d){var p=location.pathname;d.dataset.theme=p==="/"?"light":p.indexOf("/work")===0?"gallery":"dark";if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.js="1"})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothScroll>
          <Loader items={work.map((p) => ({ slug: p.slug, width: p.width, height: p.height }))} />
          <TransitionProvider header={<Header />}>{children}</TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
