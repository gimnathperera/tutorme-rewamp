import type { Metadata } from "next";

export const siteUrl = "https://www.tuitionlanka.com";
export const siteName = "Tuition Lanka";
export const defaultImage = "https://www.tuitionlanka.com/assets/preview.jpg";
export const logoUrl =
  "https://www.tuitionlanka.com/images/logo/LightThemeLogoFull.svg";

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqJsonLdItem = {
  question?: string | null;
  answer?: string | null;
};

type ArticleJsonLdConfig = {
  headline: string;
  description: string;
  image?: string | null;
  authorName?: string;
  datePublished?: string | null;
  dateModified?: string | null;
  path: string;
};

export const seoKeywords = [
  "home tutors Sri Lanka",
  "tuition Sri Lanka",
  "find tutors",
  "online teaching jobs Sri Lanka",
  "tutor vacancies Sri Lanka",
  "maths classes Sri Lanka",
  "past papers Sri Lanka",
];

const cleanMetaText = (value: string) => value.replace(/\s*&\s*/g, " and ");

const cleanTitleText = (value: string) =>
  cleanMetaText(value)
    .replace(/\s*\|\s*(?:https?:\/\/)?(?:www\.)?tuitionlanka\.com\b/gi, "")
    .replace(/\s*-\s*(?:https?:\/\/)?(?:www\.)?tuitionlanka\.com\b/gi, "")
    .replace(/\s+(?:https?:\/\/)?(?:www\.)?tuitionlanka\.com\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getCanonicalUrl(path: string) {
  return new URL(normalizePath(path), siteUrl).toString();
}

export function toAbsoluteUrl(url?: string | null) {
  if (!url) return defaultImage;
  try {
    return new URL(url, siteUrl).toString();
  } catch {
    return defaultImage;
  }
}

export function createMetadata({
  title,
  description,
  path,
  image = defaultImage,
  imageAlt = siteName,
  keywords = seoKeywords,
  noIndex = false,
}: SeoConfig): Metadata {
  const safeTitle = cleanTitleText(title);
  const safeDescription = cleanMetaText(description);
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = toAbsoluteUrl(image);

  return {
    metadataBase: new URL(siteUrl),
    title: safeTitle,
    description: safeDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: canonicalUrl,
      siteName,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
  };
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export function createFaqJsonLd(faqs: FaqJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => faq.question?.trim() && faq.answer?.trim())
      .map((faq) => ({
        "@type": "Question",
        name: faq.question?.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer?.trim(),
        },
      })),
  };
}

export function createArticleJsonLd({
  headline,
  description,
  image,
  authorName = siteName,
  datePublished,
  dateModified,
  path,
}: ArticleJsonLdConfig) {
  const canonicalUrl = getCanonicalUrl(path);
  const publishedDate = datePublished || dateModified || new Date().toISOString();
  const modifiedDate = dateModified || publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: toAbsoluteUrl(image),
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: canonicalUrl,
  };
}

export const seoPages = {
  home: {
    path: "/",
    title: "Find Home Tutors in Sri Lanka | Tuition Lanka",
    description:
      "Tuition Lanka matches parents with verified home tutors across Sri Lanka. One-to-one and small group classes for all subjects and grades.",
  },
  registerTutor: {
    path: "/register-tutor",
    title: "Register as a Home Tutor in Sri Lanka | Tuition Lanka",
    description:
      "Join Tuition Lanka as a verified home tutor in Sri Lanka. Earn flexible income by offering one-to-one or small group tuition.",
  },
  requestForTutors: {
    path: "/request-for-tutors",
    title: "Request a Home Tutor in Sri Lanka | Tuition Lanka",
    description:
      "Submit your tutor request and get matched with a verified home tutor in Sri Lanka. One-to-one and small group classes for primary, O Level, and A Level.",
  },
  testPapers: {
    path: "/test-papers",
    title: "Free O Level and A Level Test Papers | Tuition Lanka",
    description:
      "Download free O Level and A Level test papers in Sri Lanka. Practice with past exam papers and improve your results with quality study materials.",
  },
  gradesAndSubjects: {
    path: "/grades-and-subjects",
    title: "O Level and A Level Tuition Subjects | Tuition Lanka",
    description:
      "Find verified home tutors in Sri Lanka for primary, O Level, and A Level subjects. Browse tutors for maths, science, English, and more.",
  },
  tuitionRates: {
    path: "/tuition-rates",
    title: "Home Tuition Rates in Sri Lanka | Tuition Lanka",
    description:
      "Explore home tuition rates in Sri Lanka. Compare one-to-one and small group tuition fees by subject, grade, and tutor experience to find the right option.",
  },
  faq: {
    path: "/faq",
    title: "Home Tuition FAQ | Tutor Matching | Tuition Lanka",
    description:
      "Learn how home tutor matching works in Sri Lanka. Find answers about pricing, tutor qualifications, payments, and tutor registration.",
  },
  blogs: {
    path: "/blogs",
    title: "Study Tips and Exam Guides | Tuition Lanka Blog",
    description:
      "Read study tips, exam preparation strategies, and expert insights for students in Sri Lanka. Practical advice to improve exam performance and learning outcomes.",
  },
  contactUs: {
    path: "/contact-us",
    title: "Contact Us | Home Tutor Support in Sri Lanka | Tuition Lanka",
    description:
      "Contact Tuition Lanka for help with finding a home tutor or registering as a tutor in Sri Lanka. Support for all tutor matching enquiries.",
  },
  findTutor: {
    path: "/find-a-tutor",
    title: "Find a Tutor in Sri Lanka | Request Home Tuition Support",
    description:
      "Find a verified tutor in Sri Lanka for one-to-one and small group home tuition across grades, subjects, mediums, and learning needs.",
  },
  levelAndExams: {
    path: "/level-and-exams",
    title: "Levels and Exams Tuition in Sri Lanka | Tuition Lanka",
    description:
      "Explore tuition support by academic level and exam category, including primary, O Level, A Level, and specialized paths in Sri Lanka.",
  },
  tuitionAssignments: {
    path: "/tuition-assignments",
    title: "Home Tuition Assignments in Sri Lanka | Tuition Lanka",
    description:
      "Browse tuition assignments and teaching opportunities in Sri Lanka for tutors seeking students and parents looking for qualified educators.",
  },
  profile: {
    path: "/profile",
    title: "Manage Your Tuition Lanka Tutor Profile Settings Securely",
    description:
      "Manage your Tuition Lanka tutor profile, contact details, teaching preferences, languages, availability, rates, and secure account settings.",
    noIndex: true,
  },
  resetPassword: {
    path: "/reset-password",
    title: "Reset Your Tuition Lanka Account Password Securely",
    description:
      "Reset your Tuition Lanka account password securely and regain access to your tutor, parent, or admin account with protected account recovery.",
    noIndex: true,
  },
};
