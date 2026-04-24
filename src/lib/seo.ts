import type { Metadata } from "next";

const siteUrl = "https://tuitionlanka.com";
const siteName = "Tuition Lanka";
const defaultImage = "https://tuitionlanka.com/assets/preview.jpg";

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
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

export function createMetadata({
  title,
  description,
  path,
  keywords = seoKeywords,
  noIndex = false,
}: SeoConfig): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = new URL(canonicalPath, siteUrl).toString();

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      type: "website",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
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
