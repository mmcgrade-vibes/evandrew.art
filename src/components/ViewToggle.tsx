import { TLink } from "./Transition";

/** Switches between the scrolling strip on the home page and the grid page. */
export function ViewToggle({ view }: { view: "strip" | "grid" }) {
  return (
    <nav className="t-mono-label view-toggle" aria-label="Gallery view">
      <TLink href="/#work" aria-current={view === "strip"}>Strip</TLink>
      <i aria-hidden="true" />
      <TLink href="/work" aria-current={view === "grid"}>Grid</TLink>
    </nav>
  );
}
