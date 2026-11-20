import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { work } from "@/content/work";
import { PieceDetail } from "@/components/PieceDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const piece = work.find((p) => p.slug === slug);
  return piece ? { title: piece.title, description: piece.description } : {};
}

export default async function PiecePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = work.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  // The chosen piece comes first, then the rest of the gallery in order.
  const ordered = [...work.slice(index), ...work.slice(0, index)];
  return <PieceDetail items={ordered} />;
}
