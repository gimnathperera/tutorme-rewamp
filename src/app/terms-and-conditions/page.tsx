import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/terms-and-conditions",
  title: "Terms and Conditions for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read the Terms and Conditions for using Tuition Lanka as a student, parent, tutor, or website visitor, including service rules and responsibilities.",
});

const TermsAndConditionsPage = () => {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Terms and Conditions"
        path="/terms-and-conditions"
      />
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
              These Terms and Conditions govern your access to and use of the
              TuitionLanka platform, available at www.tuitionlanka.com
              (&quot;Platform&quot;). TuitionLanka is operated by SOFTVIL
              TECHNOLOGIES (PVT) LTD (Registration No: PV102511).
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. Introduction and Acceptance */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                1. Introduction and Acceptance
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  These Terms and Conditions govern your access to and use of
                  the TuitionLanka platform, available at www.tuitionlanka.com
                  (&quot;Platform&quot;). TuitionLanka is operated by SOFTVIL
                  TECHNOLOGIES (PVT) LTD (Registration No: PV102511).
                </p>
                <p>
                  By registering on, accessing, or using the Platform in any
                  capacity whether as a tutor, a parent, or a visitor you
                  confirm that you have read, understood, and agree to be bound
                  by these Terms. If you do not agree, you must not use the
                  Platform.
                </p>
              </div>
            </section>

            {/* 2. Nature of the Platform */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                2. Nature of the Platform
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka is a tutor matching platform. Our role is limited
                  to:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Accepting tutor registrations and verifying their
                    qualifications through a manual review process
                  </li>
                  <li>
                    Accepting tutor requests from parents and matching them with
                    suitable verified tutors
                  </li>
                  <li>
                    Facilitating the initial connection between parents and
                    tutors
                  </li>
                </ul>
                <p>
                  TuitionLanka is not a tutoring agency and does not employ
                  tutors. We do not supervise, direct, or control the tutoring
                  sessions that take place between tutors and students. Once
                  contact details are shared following a confirmed match,
                  TuitionLanka&apos;s role in that engagement ends, except as
                  described in these Terms.
                </p>
              </div>
            </section>

            {/* 3. Eligibility */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                3. Eligibility
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  To use the Platform, you must meet the following requirements:
                </p>

                <div>
                  <p className="font-semibold text-gray-800 mb-1">All Users</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You must be at least 18 years of age</li>
                    <li>
                      You must provide accurate and truthful information when
                      using the Platform
                    </li>
                    <li>
                      You must not use the Platform for any unlawful or
                      unauthorised purpose
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-1">Tutors</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You must be at least 18 years of age</li>
                    <li>
                      You must hold valid qualifications or credentials relevant
                      to the subjects and grades you wish to teach
                    </li>
                    <li>
                      You must submit supporting documentation for verification
                      as required by TuitionLanka
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Parents / Guardians
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      You must be the parent or legal guardian of the student
                      for whom you are requesting a tutor
                    </li>
                    <li>
                      You must ensure that the information you provide about
                      your tutoring requirements is accurate
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Tutor Registration and Verification */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                4. Tutor Registration and Verification
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  Tutors register on the Platform by completing the registration
                  form and submitting supporting verification documents. By
                  registering, tutors agree to the following:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    All information provided, including personal details,
                    qualifications, experience, fees, and profile content, is
                    accurate, current, and not misleading
                  </li>
                  <li>
                    Submitted verification documents are genuine and belong to
                    the registering tutor
                  </li>
                  <li>
                    Tutors will promptly update their profile if any information
                    changes
                  </li>
                </ul>
                <p>
                  TuitionLanka will review submitted documents manually. A tutor
                  will be designated as a Verified Tutor upon successful
                  completion of this review. TuitionLanka reserves the right to
                  reject any registration, remove verification status, or
                  suspend an account if submitted information is found to be
                  false, misleading, or in violation of these Terms.
                </p>
                <p>
                  Registration on the Platform is free of charge for tutors.
                </p>
              </div>
            </section>

            {/* 5. Tutor Profiles and Session Fees */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                5. Tutor Profiles and Session Fees
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  Tutors are responsible for setting and advertising their own
                  per session fees on their profile. By listing a fee on the
                  Platform, tutors confirm that:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    The fee is accurate and reflects what they charge for a
                    tutoring session
                  </li>
                  <li>
                    They understand that the first session fee will be collected
                    by TuitionLanka and not paid directly to them, as described
                    in Section 7
                  </li>
                  <li>
                    From the second session onwards, all fees are settled
                    directly between the tutor and the parent
                  </li>
                </ul>
                <p>
                  TuitionLanka is not responsible for any disputes arising from
                  fee arrangements made directly between tutors and parents from
                  the second session onwards.
                </p>
              </div>
            </section>

            {/* 6. Parent Tutor Requests */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                6. Parent Tutor Requests
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  Parents may submit a tutor request by completing the request
                  form on the Platform. Upon submission, TuitionLanka will
                  review the request and suggest a list of matching verified
                  tutors based on the parent&apos;s stated preferences,
                  including subject, grade, medium, location, class type, and
                  fee range.
                </p>
                <p>
                  The parent will then select one tutor from the suggested
                  options. The match is confirmed upon receipt of the first
                  session payment as described in Section 7.
                </p>
              </div>
            </section>

            {/* 7. Payment Terms */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                7. Payment Terms
              </h2>
              <div className="mt-3 space-y-5 text-sm leading-relaxed text-gray-600">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    7.1 First Session Payment
                  </h3>
                  <p className="mb-2">
                    Upon selecting a tutor, the parent is required to pay the
                    first session fee of that tutor to TuitionLanka via bank
                    transfer, prior to receiving the tutor&apos;s contact
                    details. This payment represents the tutor&apos;s advertised
                    per session fee for the first session and is retained by
                    TuitionLanka as our service fee.
                  </p>
                  <p>
                    The tutor&apos;s contact details will be shared with the
                    parent only after TuitionLanka confirms receipt of the
                    payment.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    7.2 Non Refundable Policy
                  </h3>
                  <p>
                    All first session payments made to TuitionLanka are strictly
                    non refundable. By making a payment, parents acknowledge and
                    accept this policy.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    7.3 Tutor Replacement
                  </h3>
                  <p className="mb-2">
                    If, after completing the first session, the parent is not
                    satisfied with the assigned tutor, they may request a
                    replacement. In such cases, TuitionLanka will suggest a new
                    set of matching tutors. The parent may then select a new
                    tutor and the full process including a new first session
                    payment will begin from the start.
                  </p>
                  <p>
                    No credit, carry forward, or waiver of the first session
                    payment will apply from a previous selection.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    7.4 From the Second Session Onwards
                  </h3>
                  <p>
                    TuitionLanka is not involved in any fee arrangements from
                    the second session onwards. All payments, scheduling, and
                    agreements between the tutor and parent from that point are
                    the sole responsibility of the respective parties.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Tutor Conduct and Responsibilities */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                8. Tutor Conduct and Responsibilities
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>By registering as a tutor on TuitionLanka, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Attend confirmed sessions punctually and deliver tutoring to
                    a reasonable professional standard
                  </li>
                  <li>
                    Treat students and parents with respect and professionalism
                    at all times
                  </li>
                  <li>
                    Not engage in any conduct that is harmful, inappropriate, or
                    unlawful towards students, particularly minors
                  </li>
                  <li>
                    Not misrepresent your qualifications, experience, or
                    identity to parents or students
                  </li>
                  <li>
                    Not engage in any activity that brings TuitionLanka into
                    disrepute
                  </li>
                </ul>
                <p>
                  TuitionLanka reserves the right to suspend or permanently
                  remove any tutor from the Platform who is found to be in
                  breach of these conduct standards, without notice and without
                  refund of any kind.
                </p>
              </div>
            </section>

            {/* 9. Parent and Student Conduct */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                9. Parent and Student Conduct
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p className="mb-3">Parents using the Platform agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate information in tutor requests</li>
                  <li>Treat tutors with respect and professionalism</li>
                  <li>
                    Not engage in any misleading, abusive, or fraudulent
                    behaviour towards tutors or TuitionLanka
                  </li>
                  <li>
                    Ensure that the environment in which home tuition sessions
                    take place is safe and appropriate
                  </li>
                </ul>
              </div>
            </section>

            {/* 10. Limitation of Liability */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                10. Limitation of Liability
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka acts solely as an intermediary platform. To the
                  fullest extent permitted by applicable law:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    We do not guarantee the quality, suitability, or fitness of
                    any tutor for any particular student
                  </li>
                  <li>
                    We are not liable for any loss, damage, or injury arising
                    from tutoring sessions arranged through the Platform
                  </li>
                  <li>
                    We are not responsible for the conduct, actions, or
                    omissions of any tutor or parent using the Platform
                  </li>
                  <li>
                    We are not liable for any disputes arising between tutors
                    and parents regarding sessions, fees, or conduct after the
                    first session
                  </li>
                  <li>
                    We do not guarantee the continuous, uninterrupted, or error
                    free operation of the Platform
                  </li>
                </ul>
                <p>
                  Our total liability to any user, for any claim arising out of
                  or in connection with the Platform, shall not exceed the
                  amount paid by that user to TuitionLanka.
                </p>
              </div>
            </section>

            {/* 11. Intellectual Property */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                11. Intellectual Property
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  All content on the Platform, including but not limited to
                  text, graphics, logos, and design, is the property of
                  TuitionLanka or its licensors and is protected by applicable
                  intellectual property laws. You may not reproduce, distribute,
                  or use any content from the Platform without our prior written
                  consent.
                </p>
                <p>
                  Tutor profile content submitted by tutors remains the
                  intellectual property of the respective tutor. By submitting
                  profile content, tutors grant TuitionLanka a non-exclusive
                  licence to display that content on the Platform for the
                  purpose of facilitating tutor-parent matching.
                </p>
              </div>
            </section>

            {/* 12. Account Suspension and Termination */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                12. Account Suspension and Termination
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  TuitionLanka reserves the right to suspend or terminate any
                  user account, tutor or parent at any time and without prior
                  notice, if:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    The user is found to have provided false or misleading
                    information
                  </li>
                  <li>The user has breached any provision of these Terms</li>
                  <li>
                    The user has engaged in conduct harmful to other users,
                    students, or the Platform
                  </li>
                  <li>Required by law or regulatory authority</li>
                </ul>
                <p>
                  Tutors may deactivate their account at any time by contacting
                  us at support.tuitionlanka@gmail.com.
                </p>
              </div>
            </section>

            {/* 13. Privacy */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">13. Privacy</h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p>
                  Your use of the Platform is also governed by our Privacy
                  Policy, which is incorporated into these Terms by reference.
                  Please review our Privacy Policy at
                  www.tuitionlanka.com/privacy-policy to understand our data
                  collection and use practices.
                </p>
              </div>
            </section>

            {/* 14. Governing Law */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                14. Governing Law
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of Sri Lanka. Any disputes arising in connection
                  with these Terms shall be subject to the exclusive
                  jurisdiction of the courts of Sri Lanka.
                </p>
              </div>
            </section>

            {/* 15. Changes to These Terms */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                15. Changes to These Terms
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">
                <p>
                  We reserve the right to update or modify these Terms at any
                  time. Material changes will be communicated by updating the
                  effective date at the top of this document. Your continued use
                  of the Platform after any changes constitutes your acceptance
                  of the revised Terms.
                </p>
              </div>
            </section>

            {/* 16. Contact Us */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                16. Contact Us
              </h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                <p>
                  If you have any questions or concerns about these Terms,
                  please contact us at:
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

export default TermsAndConditionsPage;
