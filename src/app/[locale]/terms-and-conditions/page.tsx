import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { createMetadata } from "@/lib/seo";
import TermsAndConditionsContent from "./TermsAndConditionsContent";

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
        <TermsAndConditionsContent />
      </div>
      <WhatsAppButton />
    </>
  );
};

export default TermsAndConditionsPage;
