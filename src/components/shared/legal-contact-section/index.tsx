import { env } from "@/configs/env";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  Mail,
  MessageCircle,
} from "lucide-react";

type LegalContactSectionProps = {
  sectionNumber: number;
  documentName: string;
};

const COMPANY_NAME = "SOFTVIL TECHNOLOGIES (PVT) LTD";
const SUPPORT_EMAIL = "support.tuitionlanka@gmail.com";
const WEBSITE_URL = "https://www.tuitionlanka.com";

const getWhatsAppContact = () => {
  const rawNumber = env.app.whatsAppNumber.replace(/\D/g, "");
  const internationalNumber = rawNumber.startsWith("0")
    ? `94${rawNumber.slice(1)}`
    : rawNumber;
  const displayNumber = internationalNumber.startsWith("94")
    ? `+94 ${internationalNumber.slice(2, 4)} ${internationalNumber.slice(4, 7)} ${internationalNumber.slice(7)}`
    : env.app.whatsAppNumber;
  const message = encodeURIComponent(
    "Hello Tuition Lanka, I need help with your legal policies.",
  );

  return {
    displayNumber,
    href: `https://wa.me/${internationalNumber}?text=${message}`,
  };
};

const LegalContactSection = ({
  sectionNumber,
  documentName,
}: LegalContactSectionProps) => {
  const whatsApp = getWhatsAppContact();

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">
        {sectionNumber}. Contact Us
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
        <p>
          If you have any questions, concerns, or requests regarding this{" "}
          {documentName}, please contact us at:
        </p>

        <div className="space-y-2 rounded-xl border border-gray-100 p-3">
          <p className="flex items-start gap-2 font-semibold text-gray-800">
            <Building2
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <span>{COMPANY_NAME}</span>
          </p>

          <div className="grid w-full max-w-full grid-cols-1 gap-2 lg:grid-cols-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="relative flex w-full max-w-full items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 pr-8 font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-all">
                <span className="text-gray-800">Email:</span> {SUPPORT_EMAIL}
              </span>
              <ArrowUpRight
                className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                aria-hidden="true"
              />
            </a>

            <a
              href={whatsApp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex w-full max-w-full items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-2.5 py-1.5 pr-8 font-semibold text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="text-gray-800">WhatsApp:</span>{" "}
                {whatsApp.displayNumber}
              </span>
              <ArrowUpRight
                className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                aria-hidden="true"
              />
            </a>

            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex w-full max-w-full items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 pr-8 font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-all">
                <span className="text-gray-800">Website:</span> {WEBSITE_URL}
              </span>
              <ArrowUpRight
                className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalContactSection;
