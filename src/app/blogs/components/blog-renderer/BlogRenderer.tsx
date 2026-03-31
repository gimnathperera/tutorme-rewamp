"use client";

import DOMPurify from "isomorphic-dompurify";

interface BlogContentBlock {
  type: string;
  text?: string;
  level?: number;
  src?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
  citation?: string;
  items?: string[];
  style?: "ordered" | "unordered";
  html?: string;
}

interface BlogRendererProps {
  content: BlogContentBlock[];
}

export default function BlogRenderer({ content }: BlogRendererProps) {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  const decodeHtml = (html: string) => {
    if (typeof document === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="blog-content-renderer space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <div
                key={index}
                className="prose dark:prose-invert max-w-none text-justify block-paragraph"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(decodeHtml(block.text || "")),
                }}
              />
            );

          case "heading": {
            const level = block.level && block.level >= 1 && block.level <= 6 ? block.level : 2;
            const HTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <HTag
                key={index}
                className={`font-semibold text-gray-900 dark:text-gray-100 block-heading ${
                  level === 1
                    ? "text-3xl"
                    : level === 2
                    ? "text-2xl mt-8 mb-4 border-b pb-2"
                    : level === 3
                    ? "text-xl mt-6 mb-3"
                    : "text-lg mt-4 mb-2"
                }`}
              >
                {block.text}
              </HTag>
            );
          }

          case "image":
            if (!block.src) return null;
            return (
              <figure key={index} className="my-10 block-image flex flex-col items-center">
                <img
                  src={block.src}
                  alt={block.caption || "Blog image"}
                  className="rounded-2xl object-cover max-h-[450px] w-auto max-w-full md:max-w-[90%] shadow-lg border dark:border-gray-700 hover:scale-[1.01] transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {block.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "table":
            return (
              <div key={index} className="overflow-x-auto my-6 block-table">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {block.headers?.map((header, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {block.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row?.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="p-4 my-6 border-s-4 border-blue-500 bg-gray-50 dark:bg-gray-800 dark:border-blue-400 block-quote"
              >
                <p className="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
                  "{block.text}"
                </p>
                {block.citation && (
                  <cite className="mt-2 block text-sm font-semibold text-gray-600 dark:text-gray-400">
                    — {block.citation}
                  </cite>
                )}
              </blockquote>
            );

          case "list": {
            const ListTag = block.style === "ordered" ? "ol" : "ul";
            const listClass =
              block.style === "ordered"
                ? "list-decimal list-inside"
                : "list-disc list-inside";
            return (
              <ListTag
                key={index}
                className={`space-y-1 text-gray-700 dark:text-gray-300 my-4 block-list ${listClass}`}
              >
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }

          case "embed":
            // To safely support embeds, we strictly sanitize if it's HTML
            if (block.html) {
              return (
                <div
                  key={index}
                  className="my-6 w-full flex justify-center block-embed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(block.html, {
                      ADD_TAGS: ["iframe"],
                      ADD_ATTR: [
                        "allow",
                        "allowfullscreen",
                        "frameborder",
                        "scrolling",
                      ],
                    }),
                  }}
                />
              );
            }
            if (block.src) {
              return (
                <div
                  key={index}
                  className="my-6 w-full flex justify-center aspect-video block-embed"
                >
                  <iframe
                    src={block.src}
                    className="w-full h-full rounded-lg shadow-sm"
                    allowFullScreen
                  />
                </div>
              );
            }
            return null;

          default:
            return null;
        }
      })}
    </div>
  );
}
