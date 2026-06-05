import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { createMetadata } from "@/lib/seo";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export const metadata = createMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy for TuitionLanka Users | TuitionLanka",
  description:
    "Read how TuitionLanka collects, uses, protects, and shares personal information when students, parents, and tutors use our platform.",
});

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageBreadcrumbJsonLd name="Privacy Policy" path="/privacy-policy" />
      <div className="mx-auto max-w-7xl mt-10 p-3 pb-10 md:p-4 md:pb-10">
        <PrivacyPolicyContent />
      </div>
      <WhatsAppButton />
    </>
  );
};

export default PrivacyPolicyPage;
