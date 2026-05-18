"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string) =>
  text.trim().replace(/\s+/g, "-").toLowerCase();

const TableOfContents = ({ html }: { html: string }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!html) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const foundHeadings = Array.from(doc.querySelectorAll("h1, h2, h3")).map(
      (h) => ({
        id: slugify(h.textContent || ""),
        text: h.textContent || "",
        level: parseInt(h.tagName.replace("H", ""), 10),
      }),
    );

    setHeadings(foundHeadings);
  }, [html]);

  const generateNumbering = (headings: Heading[]) => {
    const counters = [0, 0, 0];
    return headings.map((h) => {
      const index = h.level - 1;
      counters[index]++;
      for (let i = index + 1; i < counters.length; i++) counters[i] = 0;
      const number = counters.slice(0, h.level).filter(Boolean).join(".");
      return { ...h, number };
    });
  };

  const numberedHeadings = generateNumbering(headings);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    document.documentElement.style.scrollBehavior = "auto";
    const start = window.scrollY;
    const target = el.getBoundingClientRect().top + window.scrollY - 80;
    const startTime = performance.now();
    const step = () => {
      const progress = Math.min((performance.now() - startTime) / 2000, 1);
      window.scrollTo(0, start + (target - start) * progress);
      if (progress < 1) requestAnimationFrame(step);
      else document.documentElement.style.scrollBehavior = "";
    };
    step();
  };

  if (headings.length === 0) return null;

  return (
    <div className="border rounded-2xl bg-gray-50 p-4 mb-6 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-gray-800 text-base">
          Table of Contents
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>
      {isOpen && (
        <ul className="text-sm text-gray-700 space-y-1 mt-3">
          {numberedHeadings.map((h, i) => (
            <li
              key={i}
              style={{ marginLeft: `${(h.level - 1) * 16}px` }}
              className="hover:text-blue-600 transition-all"
            >
              <button
                type="button"
                onClick={() => scrollToHeading(h.id)}
                className="no-underline flex gap-1 text-left w-full hover:text-blue-600 transition-colors"
              >
                <span className="font-medium text-gray-800">{h.number}.</span>
                <span>{h.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableOfContents;
