import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read how Tuition Lanka collects, uses, protects, and shares personal information when students, parents, and tutors use our platform.",
});

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageBreadcrumbJsonLd name="Privacy Policy" path="/privacy-policy" />
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
              information when you use our website, submit a request, register
              as a tutor, or communicate with us.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. Introduction */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                1. Introduction
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka (&quot;we,&quot; &quot;us,&quot; or
                  &quot;our&quot;) is an online platform that connects parents
                  and students with qualified and verified home tutors across
                  Sri Lanka. We are committed to protecting the privacy of all
                  users who access or use our website at www.tuitionlanka.com
                  (the &quot;Platform&quot;). This Privacy Policy explains what
                  personal information we collect, how we use it, and the rights
                  you have in relation to it.
                </p>
                <p>
                  By using the Platform, you agree to the collection and use of
                  information in accordance with this policy.
                </p>
              </div>
            </section>

            {/* 2. Who We Are */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">2. Who We Are</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka is currently operated by SOFTVIL TECHNOLOGIES
                  (PVT) LTD (Registration No:PV102511). The Platform is managed
                  and maintained by the SOFTVIL TECHNOLOGIES team, reachable at:
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  support.tuitionlanka@gmail.com
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Website:</span>{" "}
                  https://www.tuitionlanka.com
                </p>
              </div>
            </section>

            {/* 3. Information We Collect */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                3. Information We Collect
              </h2>

              <div className="mt-4 space-y-5 text-sm leading-relaxed text-gray-600">
                {/* 3.1 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    3.1 Information Collected from Tutors
                  </h3>
                  <p className="mb-3">
                    When registering as a tutor on the Platform, we collect the
                    following:
                  </p>

                  <p className="font-semibold text-gray-800 mb-1">
                    Personal Information
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Contact number</li>
                    <li>
                      Race and nationality (used solely for tutor student
                      matching preferences)
                    </li>
                    <li>Gender</li>
                    <li>Date of birth</li>
                  </ul>

                  <p className="font-semibold text-gray-800 mb-1">
                    Professional Information
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Class type preference</li>
                    <li>Preferred teaching locations</li>
                    <li>Tutor type (e.g. Physical, online)</li>
                    <li>Highest education level</li>
                    <li>Years of teaching experience</li>
                    <li>Teaching mediums</li>
                    <li>Grades and subjects offered</li>
                    <li>Per session fee and charges</li>
                  </ul>

                  <p className="font-semibold text-gray-800 mb-1">
                    Profile Content
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Short personal introduction</li>
                    <li>
                      Summary of teaching experience and academic achievements
                    </li>
                    <li>Student results and track record</li>
                    <li>Other selling points as a tutor</li>
                  </ul>

                  <p className="font-semibold text-gray-800 mb-1">
                    Verification Documents
                  </p>
                  <p className="mb-4">
                    Tutors are required to submit supporting documents (e.g.
                    national identity card, degree certificates, professional
                    credentials, or student ID) for the purpose of identity and
                    qualification verification. These documents are reviewed
                    manually by our administrative team and are treated with
                    strict confidentiality.
                  </p>

                  <p className="font-semibold text-gray-800 mb-1">
                    Account Credentials
                  </p>
                  <p>
                    Tutors create a username and password upon registration to
                    access their account on the Platform.
                  </p>
                </div>

                {/* 3.2 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    3.2 Information Collected from Parents / Students
                  </h3>
                  <p className="mb-3">
                    When submitting a tutor request, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Full name of the parent or guardian</li>
                    <li>Email address</li>
                    <li>Contact number</li>
                    <li>District and city</li>
                    <li>
                      Preferred tutor medium, grade, number of tutors required
                    </li>
                    <li>Session duration, frequency, and class type</li>
                    <li>Preferred tutor type</li>
                  </ul>
                  <p>
                    We do not collect the personal details (name, age, or
                    identification) of the child directly. We only collect the
                    academic preferences relevant to finding a suitable tutor.
                  </p>
                </div>

                {/* 3.3 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    3.3 Automatically Collected Information
                  </h3>
                  <p className="mb-3">
                    When you visit the Platform, we may automatically collect
                    certain technical data, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on the Platform</li>
                    <li>Referring URLs</li>
                  </ul>
                  <p>
                    This data is collected through Google Analytics and is used
                    in aggregate, anonymised form for performance analysis and
                    site improvement. Please refer to Google&apos;s Privacy
                    Policy for more information on how Google processes this
                    data.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. How We Use Your Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                4. How We Use Your Information
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p className="mb-3">
                  We use the personal information we collect for the following
                  purposes:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    To verify tutor identity and qualifications through our
                    manual review process
                  </li>
                  <li>To create and manage tutor profiles on the Platform</li>
                  <li>
                    To match parent tutor requests with suitable, verified
                    tutors based on expertise, location, availability, fees, and
                    stated preferences including race and nationality
                  </li>
                  <li>
                    To facilitate the tutor suggestion and selection process
                  </li>
                  <li>
                    To process first session payments made by parents via bank
                    transfer
                  </li>
                  <li>
                    To share confirmed tutor contact details with parents upon
                    successful payment
                  </li>
                  <li>
                    To communicate with users regarding their registration,
                    requests, or enquiries
                  </li>
                  <li>
                    To improve and optimise the Platform using anonymised
                    analytics data
                  </li>
                  <li>To comply with any applicable legal obligations</li>
                </ul>
              </div>
            </section>

            {/* 5. Payment Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                5. Payment Information
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka collects a first session fee from parents as part
                  of the tutor confirmation process. This fee corresponds to the
                  advertised first session charge of the selected tutor.
                  Payments are made via bank transfer directly to TuitionLanka.
                </p>
                <p>
                  We do not collect, store, or process credit card details or
                  other payment card information on the Platform. Bank transfer
                  details shared for payment purposes are used solely to process
                  the transaction.
                </p>
                <p>
                  From the second session onwards, all fee arrangements are made
                  directly between the parent and the tutor, and TuitionLanka is
                  not a party to those transactions.
                </p>
              </div>
            </section>

            {/* 6. Sensitive Personal Data */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                6. Sensitive Personal Data
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We collect race and nationality information from tutors for
                  the sole purpose of fulfilling matching preferences indicated
                  by parents when requesting a tutor. This data is:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Not used for any discriminatory purpose</li>
                  <li>
                    Not shared with third parties beyond what is necessary for
                    the matching process
                  </li>
                  <li>
                    Stored securely and accessible only to authorised personnel
                  </li>
                </ul>
                <p>
                  By providing this information, tutors consent to its use for
                  the matching purposes described above. Tutors may contact us
                  at any time to request its removal, subject to any operational
                  limitations this may impose on matching.
                </p>
              </div>
            </section>

            {/* 7. Sharing of Your Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                7. Sharing of Your Information
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We do not sell, rent, or trade your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    With the other party (tutor or parent) once a match has been
                    confirmed and first session payment received limited to
                    contact details required to arrange sessions
                  </li>
                  <li>
                    With Google Analytics for aggregate, anonymised website
                    performance analysis
                  </li>
                  <li>
                    With authorised TuitionLanka staff involved in tutor
                    verification and tutor parent matching
                  </li>
                  <li>
                    Where required by law, regulation, or a valid legal process
                  </li>
                </ul>
              </div>
            </section>

            {/* 8. Data Retention */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                8. Data Retention
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We retain your personal information for as long as necessary
                  to provide the services described in this policy, or as
                  required by applicable law. Specifically:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Tutor profiles and account data are retained for as long as
                    the tutor account remains active
                  </li>
                  <li>
                    Parent tutor request data is retained for the duration of
                    the active engagement and for a reasonable period thereafter
                    for record keeping purposes
                  </li>
                  <li>
                    Verification documents submitted by tutors are retained for
                    the period required for compliance and quality assurance
                  </li>
                </ul>
                <p>
                  You may request deletion of your personal data at any time by
                  contacting us at support.tuitionlanka@gmail.com. We will
                  process your request subject to any legal retention
                  obligations.
                </p>
              </div>
            </section>

            {/* 9. Data Security */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                9. Data Security
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We take reasonable technical and organisational measures to
                  protect your personal information from unauthorised access,
                  disclosure, alteration, or destruction. However, no method of
                  transmission over the Internet or method of electronic storage
                  is completely secure. While we strive to use commercially
                  acceptable means to protect your information, we cannot
                  guarantee absolute security.
                </p>
              </div>
            </section>

            {/* 10. Children's Privacy */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                10. Children&apos;s Privacy
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka&apos;s services are directed at parents and adult
                  tutors. We do not knowingly collect personal information
                  directly from children under the age of 18. Parents use the
                  Platform to request tutoring for their children, but no
                  personal data of the child is collected by us directly.
                </p>
                <p>
                  All tutors registering on the Platform must be 18 years of age
                  or older and must provide valid supporting documentation as
                  part of the verification process.
                </p>
              </div>
            </section>

            {/* 11. Cookies and Analytics */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                11. Cookies and Analytics
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  The Platform uses Google Analytics to understand how visitors
                  interact with our website. Google Analytics uses cookies,
                  small text files placed on your device to collect standard
                  internet log information and visitor behaviour information in
                  an anonymous form.
                </p>
                <p>
                  You may opt out of Google Analytics tracking by installing the
                  Google Analytics Opt out Browser Add on, available at
                  https://tools.google.com/dlpage/gaoptout.
                </p>
              </div>
            </section>

            {/* 12. Your Rights */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                12. Your Rights
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>As a user of the Platform, you have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access the personal information we hold about you</li>
                  <li>
                    Request correction of inaccurate or incomplete information
                  </li>
                  <li>
                    Request deletion of your personal data, subject to legal
                    retention requirements
                  </li>
                  <li>
                    Withdraw consent for the processing of sensitive data (such
                    as race and nationality) at any time
                  </li>
                  <li>
                    Raise a concern or complaint regarding how your data is
                    handled
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at
                  support.tuitionlanka@gmail.com.
                </p>
              </div>
            </section>

            {/* 13. Changes to This Privacy Policy */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                13. Changes to This Privacy Policy
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for legal, operational, or
                  regulatory reasons. When we make material changes, we will
                  update the effective date at the top of this document. We
                  encourage you to review this policy periodically.
                </p>
                <p>
                  Continued use of the Platform after any changes constitutes
                  your acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* 14. Contact Us */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                14. Contact Us
              </h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                <p>
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy, please contact us at:
                </p>
                <p className="font-semibold text-gray-800">
                  SOFTVIL TECHNOLOGIES (PVT) LTD
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  support.tuitionlanka@gmail.com
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Website:</span>{" "}
                  https://www.tuitionlanka.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
