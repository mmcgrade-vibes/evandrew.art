import stripIcon from "@/icons/strip.json";
import gridIcon from "@/icons/grid.json";
import { LottieIcon } from "./LottieIcon";
import { TLink } from "./Transition";

/** Switches between the scrolling strip on the home page and the grid page. */
export function ViewToggle({ view }: { view: "strip" | "grid" }) {
  return (
    <nav className="view-toggle" aria-label="Gallery view">
      <TLink href="/#work" aria-current={view === "strip"} aria-label="Strip view" title="Strip view">
        <LottieIcon data={stripIcon} />
      </TLink>
      <TLink href="/work" aria-current={view === "grid"} aria-label="Grid view" title="Grid view">
        <LottieIcon data={gridIcon} />
      </TLink>
    </nav>
  );
}
