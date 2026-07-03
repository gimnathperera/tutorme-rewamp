import type { Metadata } from "next";
import { createMetadata, seoPages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({ ...seoPages.profile, locale: params.locale });
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
