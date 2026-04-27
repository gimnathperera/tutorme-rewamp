import { createBreadcrumbJsonLd } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

type PageBreadcrumbJsonLdProps = {
  name: string;
  path: string;
  parents?: Array<{
    name: string;
    path: string;
  }>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function PageBreadcrumbJsonLd({
  name,
  path,
  parents = [],
}: PageBreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={createBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        ...parents,
        { name, path },
      ])}
    />
  );
}
