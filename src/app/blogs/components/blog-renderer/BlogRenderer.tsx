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
    <div className="blog-content-renderer">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph": {
            const sanitized = DOMPurify.sanitize(
              decodeHtml(block.text || ""),
            ).trim();
            if (
              !sanitized ||
              sanitized === "<p></p>" ||
              sanitized === "<p><br></p>" ||
              sanitized === "<br>"
            )
              return null;
            return (
              <div
                key={index}
                className="prose prose-gray dark:prose-invert max-w-none text-base leading-8 text-gray-700 dark:text-gray-300 mb-5 text-justify block-paragraph"
                dangerouslySetInnerHTML={{
                  __html: sanitized,
                }}
              />
            );
          }

          case "heading": {
            const level =
              block.level && block.level >= 1 && block.level <= 6
                ? block.level
                : 2;
            const HTag = `h${level}` as keyof JSX.IntrinsicElements;
            const headingId =
              block.text?.trim().replace(/\s+/g, "-").toLowerCase() || "";

            const headingClass = {
              1: "scroll-mt-20 text-4xl font-bold text-gray-900 dark:text-white mt-12 mb-5 leading-tight",
              2: "scroll-mt-20 text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 leading-snug",
              3: "scroll-mt-20 text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-3 leading-snug",
              4: "scroll-mt-20 text-xl font-semibold text-gray-800 dark:text-gray-100 mt-7 mb-2",
              5: "scroll-mt-20 text-lg font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-2",
              6: "scroll-mt-20 text-base font-semibold text-gray-600 dark:text-gray-300 mt-5 mb-2 uppercase tracking-wide",
            }[level];

            return (
              <HTag
                key={index}
                id={headingId}
                className={`block-heading ${headingClass}`}
              >
                {block.text}
              </HTag>
            );
          }

          case "image":
            if (!block.src) return null;
            return (
              <figure key={index} className="my-10 block-image flex flex-col">
                <img
                  src={block.src}
                  alt={block.caption || "Blog image"}
                  className="rounded-2xl object-cover max-h-[360px] w-full shadow-lg border dark:border-gray-700 hover:scale-[1.01] transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {block.caption && (
                  <figcaption className="text-sm text-gray-500 mt-2 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "table":
            return (
              /* Desktop: fits the content column. Mobile/tablet: scrolls horizontally */
              <div
                key={index}
                className="my-6 block-table overflow-x-auto lg:overflow-x-visible"
              >
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {block.headers?.map((header, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider break-words"
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
                            className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 break-words text-justify"
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
                className="pl-5 py-3 my-7 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-blue-400 rounded-r-lg block-quote"
              >
                <p className="text-lg italic font-medium leading-relaxed text-gray-800 dark:text-white">
                  &quot;{block.text}&quot;
                </p>
                {block.citation && (
                  <cite className="mt-2 block text-sm font-semibold text-gray-500 dark:text-gray-400">
                    — {block.citation}
                  </cite>
                )}
              </blockquote>
            );

          case "list": {
            const ListTag = block.style === "ordered" ? "ol" : "ul";
            const listClass =
              block.style === "ordered"
                ? "list-decimal list-outside ml-5"
                : "list-disc list-outside ml-5";
            return (
              <ListTag
                key={index}
                className={`space-y-2 text-base text-justify text-gray-700 dark:text-gray-300 my-5 leading-7 block-list ${listClass}`}
              >
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }

          case "embed":
            if (block.html) {
              return (
                <div
                  key={index}
                  className="my-6 w-full aspect-video block-embed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(block.html, {
                      ADD_TAGS: ["iframe"],
                      ADD_ATTR: [
                        "allow",
                        "allowfullscreen",
                        "frameborder",
                        "scrolling",
                        "width",
                        "height",
                        "src",
                        "title",
                        "referrerpolicy",
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
                  className="my-6 w-full aspect-video block-embed"
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
