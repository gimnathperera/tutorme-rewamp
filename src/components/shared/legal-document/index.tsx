export type LegalBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "subheading";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: LegalSection[];
};

const LegalDocument = ({
  eyebrow,
  title,
  subtitle,
  intro,
  sections,
}: LegalDocumentProps) => {
  return (
    <div className="mx-auto max-w-7xl px-3 py-8 md:px-4 md:py-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-8 text-white shadow-sm sm:px-8 md:py-10">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-100">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-blue-50 md:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      <div className="mt-8 rounded-3xl bg-lightgrey px-4 py-6 sm:px-8 lg:px-10">
        <section className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            TuitionLanka Legal
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base">
            {intro}
          </p>
        </section>

        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <section
              key={section.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                  {sectionIndex + 1}
                </span>
                <h2 className="pt-1 text-lg font-bold leading-7 text-gray-900 md:text-xl">
                  {section.title}
                </h2>
              </div>

              <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600 sm:pl-11 md:text-base">
                {section.blocks.map((block, blockIndex) => {
                  if (block.type === "subheading") {
                    return (
                      <h3
                        key={`${section.title}-subheading-${blockIndex}`}
                        className="pt-2 text-base font-semibold text-gray-900"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <ul
                        key={`${section.title}-list-${blockIndex}`}
                        className="list-disc space-y-2 pl-5"
                      >
                        {block.items.map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={`${section.title}-paragraph-${blockIndex}`}>
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalDocument;
