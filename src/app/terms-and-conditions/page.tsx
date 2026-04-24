import LegalDocument, {
  type LegalSection,
} from "@/components/shared/legal-document";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/terms-and-conditions",
  title: "Terms and Conditions for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read the Terms and Conditions for using Tuition Lanka as a student, parent, tutor, or website visitor, including service rules and responsibilities.",
});

const termsSections: LegalSection[] = [
  {
    title: "Introduction and Acceptance",
    blocks: [
      {
        type: "paragraph",
        text: 'These Terms and Conditions govern your access to and use of the TuitionLanka platform, available at tuitionlanka.com ("Platform"). TuitionLanka is operated by SOFTVIL TECHNOLOGIES (PVT) LTD (Registration No: PV102511).',
      },
      {
        type: "paragraph",
        text: "By registering on, accessing, or using the Platform in any capacity whether as a tutor, a parent, or a visitor you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the Platform.",
      },
    ],
  },
  {
    title: "Nature of the Platform",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka is a tutor matching platform. Our role is limited to:",
      },
      {
        type: "list",
        items: [
          "Accepting tutor registrations and verifying their qualifications through a manual review process",
          "Accepting tutor requests from parents and matching them with suitable verified tutors",
          "Facilitating the initial connection between parents and tutors",
        ],
      },
      {
        type: "paragraph",
        text: "TuitionLanka is not a tutoring agency and does not employ tutors. We do not supervise, direct, or control the tutoring sessions that take place between tutors and students. Once contact details are shared following a confirmed match, TuitionLanka's role in that engagement ends, except as described in these Terms.",
      },
    ],
  },
  {
    title: "Eligibility",
    blocks: [
      {
        type: "paragraph",
        text: "To use the Platform, you must meet the following requirements:",
      },
      {
        type: "subheading",
        text: "All Users",
      },
      {
        type: "list",
        items: [
          "You must be at least 18 years of age",
          "You must provide accurate and truthful information when using the Platform",
          "You must not use the Platform for any unlawful or unauthorised purpose",
        ],
      },
      {
        type: "subheading",
        text: "Tutors",
      },
      {
        type: "list",
        items: [
          "You must be at least 18 years of age",
          "You must hold valid qualifications or credentials relevant to the subjects and grades you wish to teach",
          "You must submit supporting documentation for verification as required by TuitionLanka",
        ],
      },
      {
        type: "subheading",
        text: "Parents / Guardians",
      },
      {
        type: "list",
        items: [
          "You must be the parent or legal guardian of the student for whom you are requesting a tutor",
          "You must ensure that the information you provide about your tutoring requirements is accurate",
        ],
      },
    ],
  },
  {
    title: "Tutor Registration and Verification",
    blocks: [
      {
        type: "paragraph",
        text: "Tutors register on the Platform by completing the registration form and submitting supporting verification documents. By registering, tutors agree to the following:",
      },
      {
        type: "list",
        items: [
          "All information provided, including personal details, qualifications, experience, fees, and profile content, is accurate, current, and not misleading",
          "Submitted verification documents are genuine and belong to the registering tutor",
          "Tutors will promptly update their profile if any information changes",
        ],
      },
      {
        type: "paragraph",
        text: "TuitionLanka will review submitted documents manually. A tutor will be designated as a Verified Tutor upon successful completion of this review. TuitionLanka reserves the right to reject any registration, remove verification status, or suspend an account if submitted information is found to be false, misleading, or in violation of these Terms.",
      },
      {
        type: "paragraph",
        text: "Registration on the Platform is free of charge for tutors.",
      },
    ],
  },
  {
    title: "Tutor Profiles and Session Fees",
    blocks: [
      {
        type: "paragraph",
        text: "Tutors are responsible for setting and advertising their own per session fees on their profile. By listing a fee on the Platform, tutors confirm that:",
      },
      {
        type: "list",
        items: [
          "The fee is accurate and reflects what they charge for a tutoring session",
          "They understand that the first session fee will be collected by TuitionLanka and not paid directly to them, as described in Section 7",
          "From the second session onwards, all fees are settled directly between the tutor and the parent",
        ],
      },
      {
        type: "paragraph",
        text: "TuitionLanka is not responsible for any disputes arising from fee arrangements made directly between tutors and parents from the second session onwards.",
      },
    ],
  },
  {
    title: "Parent Tutor Requests",
    blocks: [
      {
        type: "paragraph",
        text: "Parents may submit a tutor request by completing the request form on the Platform. Upon submission, TuitionLanka will review the request and suggest a list of matching verified tutors based on the parent's stated preferences, including subject, grade, medium, location, class type, and fee range.",
      },
      {
        type: "paragraph",
        text: "The parent will then select one tutor from the suggested options. The match is confirmed upon receipt of the first session payment as described in Section 7.",
      },
    ],
  },
  {
    title: "Payment Terms",
    blocks: [
      {
        type: "subheading",
        text: "7.1 First Session Payment",
      },
      {
        type: "paragraph",
        text: "Upon selecting a tutor, the parent is required to pay the first session fee of that tutor to TuitionLanka via bank transfer, prior to receiving the tutor's contact details. This payment represents the tutor's advertised per session fee for the first session and is retained by TuitionLanka as our service fee.",
      },
      {
        type: "paragraph",
        text: "The tutor's contact details will be shared with the parent only after TuitionLanka confirms receipt of the payment.",
      },
      {
        type: "subheading",
        text: "7.2 Non Refundable Policy",
      },
      {
        type: "paragraph",
        text: "All first session payments made to TuitionLanka are strictly non refundable. By making a payment, parents acknowledge and accept this policy.",
      },
      {
        type: "subheading",
        text: "7.3 Tutor Replacement",
      },
      {
        type: "paragraph",
        text: "If, after completing the first session, the parent is not satisfied with the assigned tutor, they may request a replacement. In such cases, TuitionLanka will suggest a new set of matching tutors. The parent may then select a new tutor and the full process including a new first session payment will begin from the start.",
      },
      {
        type: "paragraph",
        text: "No credit, carry forward, or waiver of the first session payment will apply from a previous selection.",
      },
      {
        type: "subheading",
        text: "7.4 From the Second Session Onwards",
      },
      {
        type: "paragraph",
        text: "TuitionLanka is not involved in any fee arrangements from the second session onwards. All payments, scheduling, and agreements between the tutor and parent from that point are the sole responsibility of the respective parties.",
      },
    ],
  },
  {
    title: "Tutor Conduct and Responsibilities",
    blocks: [
      {
        type: "paragraph",
        text: "By registering as a tutor on TuitionLanka, you agree to:",
      },
      {
        type: "list",
        items: [
          "Attend confirmed sessions punctually and deliver tutoring to a reasonable professional standard",
          "Treat students and parents with respect and professionalism at all times",
          "Not engage in any conduct that is harmful, inappropriate, or unlawful towards students, particularly minors",
          "Not misrepresent your qualifications, experience, or identity to parents or students",
          "Not engage in any activity that brings TuitionLanka into disrepute",
        ],
      },
      {
        type: "paragraph",
        text: "TuitionLanka reserves the right to suspend or permanently remove any tutor from the Platform who is found to be in breach of these conduct standards, without notice and without refund of any kind.",
      },
    ],
  },
  {
    title: "Parent and Student Conduct",
    blocks: [
      {
        type: "paragraph",
        text: "Parents using the Platform agree to:",
      },
      {
        type: "list",
        items: [
          "Provide accurate information in tutor requests",
          "Treat tutors with respect and professionalism",
          "Not engage in any misleading, abusive, or fraudulent behaviour towards tutors or TuitionLanka",
          "Ensure that the environment in which home tuition sessions take place is safe and appropriate",
        ],
      },
    ],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka acts solely as an intermediary platform. To the fullest extent permitted by applicable law:",
      },
      {
        type: "list",
        items: [
          "We do not guarantee the quality, suitability, or fitness of any tutor for any particular student",
          "We are not liable for any loss, damage, or injury arising from tutoring sessions arranged through the Platform",
          "We are not responsible for the conduct, actions, or omissions of any tutor or parent using the Platform",
          "We are not liable for any disputes arising between tutors and parents regarding sessions, fees, or conduct after the first session",
          "We do not guarantee the continuous, uninterrupted, or error free operation of the Platform",
        ],
      },
      {
        type: "paragraph",
        text: "Our total liability to any user, for any claim arising out of or in connection with the Platform, shall not exceed the amount paid by that user to TuitionLanka.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    blocks: [
      {
        type: "paragraph",
        text: "All content on the Platform, including but not limited to text, graphics, logos, and design, is the property of TuitionLanka or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content from the Platform without our prior written consent.",
      },
      {
        type: "paragraph",
        text: "Tutor profile content submitted by tutors remains the intellectual property of the respective tutor. By submitting profile content, tutors grant TuitionLanka a non-exclusive licence to display that content on the Platform for the purpose of facilitating tutor-parent matching.",
      },
    ],
  },
  {
    title: "Account Suspension and Termination",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka reserves the right to suspend or terminate any user account, tutor or parent, at any time and without prior notice, if:",
      },
      {
        type: "list",
        items: [
          "The user is found to have provided false or misleading information",
          "The user has breached any provision of these Terms",
          "The user has engaged in conduct harmful to other users, students, or the Platform",
          "Required by law or regulatory authority",
        ],
      },
      {
        type: "paragraph",
        text: "Tutors may deactivate their account at any time by contacting us at support.tuitionlanka@gmail.com.",
      },
    ],
  },
  {
    title: "Privacy",
    blocks: [
      {
        type: "paragraph",
        text: "Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at tuitionlanka.com/privacy-policy to understand our data collection and use practices.",
      },
    ],
  },
  {
    title: "Governing Law",
    blocks: [
      {
        type: "paragraph",
        text: "These Terms shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
      },
    ],
  },
  {
    title: "Changes to These Terms",
    blocks: [
      {
        type: "paragraph",
        text: "We reserve the right to update or modify these Terms at any time. Material changes will be communicated by updating the effective date at the top of this document. Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms.",
      },
    ],
  },
  {
    title: "Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have any questions or concerns about these Terms, please contact us at:",
      },
      {
        type: "list",
        items: [
          "SOFTVIL TECHNOLOGIES (PVT) LTD",
          "Email: support.tuitionlanka@gmail.com",
          "Website: https://tuitionlanka.com",
        ],
      },
    ],
  },
];

const TermsAndConditionsPage = () => {
  return (
    <LegalDocument
      eyebrow="Terms and Conditions"
      title="Terms and Conditions"
      subtitle="TuitionLanka"
      intro="This page includes the full Terms and Conditions content provided in the official TuitionLanka document."
      sections={termsSections}
    />
  );
};

export default TermsAndConditionsPage;
