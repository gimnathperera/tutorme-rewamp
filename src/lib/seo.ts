import type { Metadata } from "next";

const siteUrl = "https://www.tuitionlanka.com";
const siteName = "Tuition Lanka";
const defaultImage = "/images/banner/banner.png";

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
      canonical: canonicalPath,
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
    title:
      "Home Tutors and Teaching Vacancies in Sri Lanka | Qualified Matching",
    description:
      "Find expert home tutors for personalized support or browse tutor vacancies in Colombo and Sri Lanka. We connect parents with teachers for primary teaching vacancies and online teaching jobs.",
  },
  registerTutor: {
    path: "/register-tutor",
    title:
      "tutor and Teaching Vacancies in Sri Lanka | Register as a Home Tutor",
    description:
      "Looking for tutor vacancies in Colombo or online teaching jobs in Sri Lanka? Join our platform and get matched with parents seeking qualified home tutors for personalised academic support.",
  },
  requestForTutors: {
    path: "/request-for-tutors",
    title:
      "Find a Home Tutor by Grade and Subject | Maths, English, Science and More in Sri Lanka",
    description:
      "Browse tutors by grade and subject from O/L Maths and A/L Physics to Spoken English and Elocution. Find qualified home tutors for all grades in Sinhala or English medium across Sri Lanka.",
  },
  testPapers: {
    path: "/test-papers",
    title:
      "Past Papers Sri Lanka | O/L and A/L Maths Past Papers and Test Papers Free Download",
    description:
      "Access O/L and A/L past papers and test papers including Maths, Science, and more. Download free past papers and test papers to help students prepare and excel in exams across Sri Lanka.",
  },
  gradesAndSubjects: {
    path: "/grades-and-subjects",
    title:
      "Explore Tuition Grades and Subjects | Maths, Science, English in Sri Lanka",
    description:
      "Browse our comprehensive list of subjects and grades for home tuition in Sri Lanka. Find expert tutors for O/L, A/L, primary, and specialized subjects today.",
  },
  tuitionRates: {
    path: "/tuition-rates",
    title: "Home Tuition Rates and Fees in Sri Lanka | Tuition Lanka",
    description:
      "Compare affordable home tuition rates and fees across Sri Lanka. Find detailed pricing for primary, O/L, A/L, and online classes to easily suit your budget.",
  },
  faq: {
    path: "/faq",
    title: "Frequently Asked Questions | Tuition Lanka Help Center",
    description:
      "Have questions about finding a home tutor or registering as a teacher in Sri Lanka? Read our FAQs for parents and tutors to get all the answers you need.",
  },
  blogs: {
    path: "/blogs",
    title: "Tuition Lanka Blog | Education Tips, Exam Guides and Tutor Advice",
    description:
      "Read the latest articles on exam preparation, study tips, and education news in Sri Lanka. Discover expert advice tailored for students, parents, and home tutors.",
  },
  contactUs: {
    path: "/contact-us",
    title:
      "Contact Tuition Lanka | Support for Parents and Tutors in Sri Lanka",
    description:
      "Get in touch with Tuition Lanka for inquiries about finding a home tutor, tutor vacancies, or website support. We're here to help students and teachers succeed.",
  },
  findTutor: {
    path: "/find-a-tutor",
    title: "Find a Tutor in Sri Lanka | Request Home Tuition Support",
    description:
      "Request a qualified home tutor in Sri Lanka for personalized academic support across grades, subjects, and learning needs.",
  },
  levelAndExams: {
    path: "/level-and-exams",
    title: "Levels and Exams Tuition in Sri Lanka | Tuition Lanka",
    description:
      "Explore tuition support by academic level and exam category, including primary, O/L, A/L, and specialized learning paths in Sri Lanka.",
  },
  tuitionAssignments: {
    path: "/tuition-assignments",
    title: "Tuition Assignments in Sri Lanka | Find Teaching Opportunities",
    description:
      "Browse tuition assignments and teaching opportunities in Sri Lanka for tutors seeking students and parents looking for qualified educators.",
  },
  profile: {
    path: "/profile",
    title: "Profile Settings | Tuition Lanka",
    description:
      "Manage your Tuition Lanka profile, contact details, teaching preferences, languages, availability, and account settings.",
    noIndex: true,
  },
  resetPassword: {
    path: "/reset-password",
    title: "Reset Password | Tuition Lanka",
    description:
      "Reset your Tuition Lanka account password securely and regain access to your tutor or admin account.",
    noIndex: true,
  },
};
