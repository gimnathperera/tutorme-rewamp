import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grades & Subjects | Tuition Lanka",
  description: "Browse grades and explore the subjects offered by Tuition Lanka.",
};

export default function GradesAndSubjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
