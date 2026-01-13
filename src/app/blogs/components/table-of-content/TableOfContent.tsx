"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = ({ html }: { html: string }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!html) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const foundHeadings = Array.from(doc.querySelectorAll("h1, h2, h3")).map(
      (h) => ({
        id: h.textContent?.replace(/\s+/g, "-").toLowerCase() || "",
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

  if (headings.length === 0) return null;

  return (
    <div className="border rounded-md bg-gray-50 p-4 mb-6 shadow-sm">
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
              <a href={`#${h.id}`} className="no-underline flex gap-1">
                <span className="font-medium text-gray-800">{h.number}.</span>
                <span>{h.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableOfContents;
