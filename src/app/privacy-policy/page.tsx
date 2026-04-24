import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read how Tuition Lanka collects, uses, protects, and shares personal information when students, parents, and tutors use our platform.",
});

const policySections = [
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide when you contact us, request a tutor, register as a tutor, create an account, update your profile, submit forms, or communicate with Tuition Lanka.",
      "This may include your name, contact number, email address, location, academic requirements, teaching subjects, qualifications, availability, profile details, and any message or document you choose to share with us.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information to respond to inquiries, match students and parents with suitable tutors, manage tutor registrations, support tuition assignments, improve our services, and keep the platform secure.",
      "We may also use contact details to send service-related updates, confirm requests, follow up on tutor matching, and provide customer support.",
    ],
  },
  {
    title: "Sharing Information",
    body: [
      "We may share relevant request details with tutors or relevant tutor profile details with parents and students when it is necessary to support a tuition inquiry or assignment.",
      "We do not sell personal information. We may share information with trusted service providers who help us operate the website, communicate with users, or maintain the platform, subject to appropriate confidentiality expectations.",
    ],
  },
  {
    title: "Cookies and Website Data",
    body: [
      "Our website may use cookies, analytics, and similar technologies to remember preferences, understand site usage, improve performance, and protect against misuse.",
      "You can manage cookies through your browser settings, but some website features may not work correctly if cookies are disabled.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We use reasonable technical and organizational measures to protect personal information from unauthorized access, loss, misuse, or alteration.",
      "No online platform can guarantee absolute security, so users should also take care when sharing sensitive information and keeping account credentials private.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep personal information for as long as needed to provide our services, respond to inquiries, maintain records, resolve disputes, comply with legal obligations, and improve platform safety.",
      "When information is no longer required, we may delete, anonymize, or securely archive it according to operational and legal requirements.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may contact us to request access, correction, or deletion of personal information we hold about you, subject to verification and any legal or operational limits.",
      "You may also unsubscribe from non-essential communications where an unsubscribe option is provided, or contact us for support.",
    ],
  },
  {
    title: "Children and Student Information",
    body: [
      "Tuition Lanka may process student information provided by parents, guardians, or authorized users for the purpose of finding suitable tuition support.",
      "Parents and guardians should ensure that information shared about a student is accurate and appropriate for the tuition request.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions about this Privacy Policy or how your information is handled, contact us at support.tuitionlanka@gmail.com.",
    ],
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto max-w-7xl mt-10 p-3 pb-10 md:p-4 md:pb-10">
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden mb-8">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            TuitionLanka Legal
          </p>
          <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-1">
            How we collect, use, and protect information on Tuition Lanka.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
      </div>

      <div className="rounded-3xl bg-lightgrey px-4 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">
            Last updated: April 23, 2026
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            This Privacy Policy explains how Tuition Lanka handles personal
            information when you use our website, submit a request, register as
            a tutor, or communicate with us.
          </p>
        </div>

        <div className="space-y-4">
          {policySections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-gray-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
