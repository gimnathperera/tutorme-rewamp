import LegalDocument, {
  type LegalSection,
} from "@/components/shared/legal-document";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy for Tuition Lanka Users | Tuition Lanka",
  description:
    "Read how Tuition Lanka collects, uses, protects, and shares personal information when students, parents, and tutors use our platform.",
});

const policySections: LegalSection[] = [
  {
    title: "Introduction",
    blocks: [
      {
        type: "paragraph",
        text: 'TuitionLanka ("we," "us," or "our") is an online platform that connects parents and students with qualified and verified home tutors across Sri Lanka. We are committed to protecting the privacy of all users who access or use our website at tuitionlanka.com (the "Platform"). This Privacy Policy explains what personal information we collect, how we use it, and the rights you have in relation to it.',
      },
      {
        type: "paragraph",
        text: "By using the Platform, you agree to the collection and use of information in accordance with this policy.",
      },
    ],
  },
  {
    title: "Who We Are",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka is currently operated by SOFTVIL TECHNOLOGIES (PVT) LTD (Registration No:PV102511). The Platform is managed and maintained by the SOFTVIL TECHNOLOGIES team, reachable at:",
      },
      {
        type: "list",
        items: [
          "Email: support.tuitionlanka@gmail.com",
          "Website: https://tuitionlanka.com",
        ],
      },
    ],
  },
  {
    title: "Information We Collect",
    blocks: [
      {
        type: "subheading",
        text: "3.1 Information Collected from Tutors",
      },
      {
        type: "paragraph",
        text: "When registering as a tutor on the Platform, we collect the following:",
      },
      {
        type: "subheading",
        text: "Personal Information",
      },
      {
        type: "list",
        items: [
          "Full name",
          "Email address",
          "Contact number",
          "Race and nationality (used solely for tutor student matching preferences)",
          "Gender",
          "Date of birth",
        ],
      },
      {
        type: "subheading",
        text: "Professional Information",
      },
      {
        type: "list",
        items: [
          "Class type preference",
          "Preferred teaching locations",
          "Tutor type (e.g. Physical, online)",
          "Highest education level",
          "Years of teaching experience",
          "Teaching mediums",
          "Grades and subjects offered",
          "Per session fee and charges",
        ],
      },
      {
        type: "subheading",
        text: "Profile Content",
      },
      {
        type: "list",
        items: [
          "Short personal introduction",
          "Summary of teaching experience and academic achievements",
          "Student results and track record",
          "Other selling points as a tutor",
        ],
      },
      {
        type: "subheading",
        text: "Verification Documents",
      },
      {
        type: "paragraph",
        text: "Tutors are required to submit supporting documents (e.g. national identity card, degree certificates, professional credentials, or student ID) for the purpose of identity and qualification verification. These documents are reviewed manually by our administrative team and are treated with strict confidentiality.",
      },
      {
        type: "subheading",
        text: "Account Credentials",
      },
      {
        type: "paragraph",
        text: "Tutors create a username and password upon registration to access their account on the Platform.",
      },
      {
        type: "subheading",
        text: "3.2 Information Collected from Parents / Students",
      },
      {
        type: "paragraph",
        text: "When submitting a tutor request, we collect:",
      },
      {
        type: "list",
        items: [
          "Full name of the parent or guardian",
          "Email address",
          "Contact number",
          "District and city",
          "Preferred tutor medium, grade, number of tutors required",
          "Session duration, frequency, and class type",
          "Preferred tutor type",
        ],
      },
      {
        type: "paragraph",
        text: "We do not collect the personal details (name, age, or identification) of the child directly. We only collect the academic preferences relevant to finding a suitable tutor.",
      },
      {
        type: "subheading",
        text: "3.3 Automatically Collected Information",
      },
      {
        type: "paragraph",
        text: "When you visit the Platform, we may automatically collect certain technical data, including:",
      },
      {
        type: "list",
        items: [
          "IP address",
          "Browser type and version",
          "Pages visited and time spent on the Platform",
          "Referring URLs",
        ],
      },
      {
        type: "paragraph",
        text: "This data is collected through Google Analytics and is used in aggregate, anonymised form for performance analysis and site improvement. Please refer to Google's Privacy Policy for more information on how Google processes this data.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    blocks: [
      {
        type: "paragraph",
        text: "We use the personal information we collect for the following purposes:",
      },
      {
        type: "list",
        items: [
          "To verify tutor identity and qualifications through our manual review process",
          "To create and manage tutor profiles on the Platform",
          "To match parent tutor requests with suitable, verified tutors based on expertise, location, availability, fees, and stated preferences including race and nationality",
          "To facilitate the tutor suggestion and selection process",
          "To process first session payments made by parents via bank transfer",
          "To share confirmed tutor contact details with parents upon successful payment",
          "To communicate with users regarding their registration, requests, or enquiries",
          "To improve and optimise the Platform using anonymised analytics data",
          "To comply with any applicable legal obligations",
        ],
      },
    ],
  },
  {
    title: "Payment Information",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka collects a first session fee from parents as part of the tutor confirmation process. This fee corresponds to the advertised first session charge of the selected tutor. Payments are made via bank transfer directly to TuitionLanka.",
      },
      {
        type: "paragraph",
        text: "We do not collect, store, or process credit card details or other payment card information on the Platform. Bank transfer details shared for payment purposes are used solely to process the transaction.",
      },
      {
        type: "paragraph",
        text: "From the second session onwards, all fee arrangements are made directly between the parent and the tutor, and TuitionLanka is not a party to those transactions.",
      },
    ],
  },
  {
    title: "Sensitive Personal Data",
    blocks: [
      {
        type: "paragraph",
        text: "We collect race and nationality information from tutors for the sole purpose of fulfilling matching preferences indicated by parents when requesting a tutor. This data is:",
      },
      {
        type: "list",
        items: [
          "Not used for any discriminatory purpose",
          "Not shared with third parties beyond what is necessary for the matching process",
          "Stored securely and accessible only to authorised personnel",
        ],
      },
      {
        type: "paragraph",
        text: "By providing this information, tutors consent to its use for the matching purposes described above. Tutors may contact us at any time to request its removal, subject to any operational limitations this may impose on matching.",
      },
    ],
  },
  {
    title: "Sharing of Your Information",
    blocks: [
      {
        type: "paragraph",
        text: "We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:",
      },
      {
        type: "list",
        items: [
          "With the other party (tutor or parent) once a match has been confirmed and first session payment received limited to contact details required to arrange sessions",
          "With Google Analytics for aggregate, anonymised website performance analysis",
          "With authorised TuitionLanka staff involved in tutor verification and tutor parent matching",
          "Where required by law, regulation, or a valid legal process",
        ],
      },
    ],
  },
  {
    title: "Data Retention",
    blocks: [
      {
        type: "paragraph",
        text: "We retain your personal information for as long as necessary to provide the services described in this policy, or as required by applicable law. Specifically:",
      },
      {
        type: "list",
        items: [
          "Tutor profiles and account data are retained for as long as the tutor account remains active",
          "Parent tutor request data is retained for the duration of the active engagement and for a reasonable period thereafter for record keeping purposes",
          "Verification documents submitted by tutors are retained for the period required for compliance and quality assurance",
        ],
      },
      {
        type: "paragraph",
        text: "You may request deletion of your personal data at any time by contacting us at support.tuitionlanka@gmail.com. We will process your request subject to any legal retention obligations.",
      },
    ],
  },
  {
    title: "Data Security",
    blocks: [
      {
        type: "paragraph",
        text: "We take reasonable technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.",
      },
    ],
  },
  {
    title: "Children's Privacy",
    blocks: [
      {
        type: "paragraph",
        text: "TuitionLanka's services are directed at parents and adult tutors. We do not knowingly collect personal information directly from children under the age of 18. Parents use the Platform to request tutoring for their children, but no personal data of the child is collected by us directly.",
      },
      {
        type: "paragraph",
        text: "All tutors registering on the Platform must be 18 years of age or older and must provide valid supporting documentation as part of the verification process.",
      },
    ],
  },
  {
    title: "Cookies and Analytics",
    blocks: [
      {
        type: "paragraph",
        text: "The Platform uses Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies, small text files placed on your device to collect standard internet log information and visitor behaviour information in an anonymous form.",
      },
      {
        type: "paragraph",
        text: "You may opt out of Google Analytics tracking by installing the Google Analytics Opt out Browser Add on, available at https://tools.google.com/dlpage/gaoptout.",
      },
    ],
  },
  {
    title: "Your Rights",
    blocks: [
      {
        type: "paragraph",
        text: "As a user of the Platform, you have the right to:",
      },
      {
        type: "list",
        items: [
          "Access the personal information we hold about you",
          "Request correction of inaccurate or incomplete information",
          "Request deletion of your personal data, subject to legal retention requirements",
          "Withdraw consent for the processing of sensitive data (such as race and nationality) at any time",
          "Raise a concern or complaint regarding how your data is handled",
        ],
      },
      {
        type: "paragraph",
        text: "To exercise any of these rights, please contact us at support.tuitionlanka@gmail.com.",
      },
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make material changes, we will update the effective date at the top of this document. We encourage you to review this policy periodically.",
      },
      {
        type: "paragraph",
        text: "Continued use of the Platform after any changes constitutes your acceptance of the updated policy.",
      },
    ],
  },
  {
    title: "Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:",
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

const PrivacyPolicyPage = () => {
  return (
    <LegalDocument
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="TuitionLanka"
      intro="This page includes the full Privacy Policy content provided in the official TuitionLanka document."
      sections={policySections}
    />
  );
};

export default PrivacyPolicyPage;
