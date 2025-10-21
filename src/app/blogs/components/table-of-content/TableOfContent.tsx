import { useEffect, useState } from "react";

const TableOfContents = ({ html }: { html: string }) => {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    if (!html) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const foundHeadings = Array.from(doc.querySelectorAll("h1, h2, h3")).map(
      (h) => ({
        id: h.textContent?.replace(/\s+/g, "-").toLowerCase() || "",
        text: h.textContent || "",
        level: parseInt(h.tagName.replace("H", ""), 10),
      })
    );
    setHeadings(foundHeadings);
  }, [html]);

  if (headings.length === 0) return null;

  return (
    <div className="border rounded-md bg-gray-50 p-4 mb-6">
      <h3 className="font-semibold mb-3 text-gray-800">Table of Contents</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        {headings.map((h, i) => (
          <li
            key={i}
            className={`ml-${(h.level - 1) * 4} hover:text-blue-600 transition`}
          >
            <a href={`#${h.id}`} className="no-underline">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
