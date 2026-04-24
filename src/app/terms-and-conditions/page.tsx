import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/terms-and-conditions",
  title: "Terms and Conditions for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read the Terms and Conditions for using Tuition Lanka as a student, parent, tutor, or website visitor, including service rules and responsibilities.",
});

const termsSections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using Tuition Lanka, submitting a tutor request, registering as a tutor, or communicating with us, you agree to these Terms and Conditions.",
      "If you do not agree with these terms, please do not use the website or submit information through our platform.",
    ],
  },
  {
    title: "Our Service",
    body: [
      "Tuition Lanka helps students, parents, and tutors connect for home tuition, online tuition, tuition requests, tutor registrations, and related educational support.",
      "We may review requests, share relevant details with suitable tutors or parents, and help coordinate introductions, but we do not guarantee that a particular tutor, student, assignment, result, or learning outcome will be available.",
    ],
  },
  {
    title: "User Responsibilities",
    body: [
      "You agree to provide accurate, current, and complete information when using our forms, registering, requesting a tutor, or updating your profile.",
      "You must not misuse the website, submit false information, impersonate another person, interfere with platform security, or use Tuition Lanka for unlawful, harmful, or misleading activity.",
    ],
  },
  {
    title: "Tutor Responsibilities",
    body: [
      "Tutors are responsible for the accuracy of their qualifications, experience, teaching subjects, availability, fees, and profile information.",
      "Tutors must conduct themselves professionally, communicate respectfully, protect student information, and comply with applicable laws and educational standards.",
    ],
  },
  {
    title: "Parent and Student Responsibilities",
    body: [
      "Parents, guardians, and students are responsible for reviewing tutor suitability, confirming lesson arrangements, and ensuring a safe and appropriate learning environment.",
      "Any tuition arrangement, schedule, fee, cancellation, or lesson-specific agreement should be clearly discussed and confirmed between the relevant parties.",
    ],
  },
  {
    title: "Payments and Arrangements",
    body: [
      "Unless Tuition Lanka expressly states otherwise for a specific service, tuition fees and lesson arrangements are agreed directly between the parent, student, and tutor.",
      "Tuition Lanka is not responsible for private payment disputes, missed lessons, cancellations, refunds, or separate agreements made outside the platform.",
    ],
  },
  {
    title: "Content and Intellectual Property",
    body: [
      "The website design, branding, text, graphics, features, and other platform content belong to Tuition Lanka or its licensors and may not be copied or reused without permission.",
      "When you submit content such as profile details, requests, images, or documents, you confirm that you have the right to share it and allow Tuition Lanka to use it for operating and improving the service.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Tuition Lanka aims to provide a reliable and helpful platform, but the website and services are provided on an as-available basis.",
      "To the fullest extent permitted by law, Tuition Lanka is not liable for indirect loss, academic outcomes, private disputes, service interruptions, or actions of users, tutors, students, parents, or third parties.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these Terms and Conditions from time to time to reflect changes in our services, legal requirements, or platform operations.",
      "The updated version will be posted on this page with a revised last updated date. Continued use of Tuition Lanka after changes are posted means you accept the updated terms.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions about these Terms and Conditions, contact us at support.tuitionlanka@gmail.com.",
    ],
  },
];

const TermsAndConditionsPage = () => {
  return (
    <div className="mx-auto max-w-7xl mt-10 p-3 pb-10 md:p-4 md:pb-10">
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden mb-8">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            TuitionLanka Legal
          </p>
          <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-1">
            The rules and responsibilities for using Tuition Lanka.
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
            These Terms and Conditions govern your use of Tuition Lanka as a
            student, parent, guardian, tutor, visitor, or registered user.
          </p>
        </div>

        <div className="space-y-4">
          {termsSections.map((section) => (
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

export default TermsAndConditionsPage;
