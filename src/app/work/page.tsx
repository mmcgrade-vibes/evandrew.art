import type { Metadata } from "next";
import { work } from "@/content/work";
import { InfiniteGrid } from "@/components/InfiniteGrid";

export const metadata: Metadata = { title: "Work" };

export default function WorkGrid() {
  return <InfiniteGrid items={work} />;
}
