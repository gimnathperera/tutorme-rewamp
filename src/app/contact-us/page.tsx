"use client";

import InputMultiLineText from "@/components/shared/input-multi-line-text";
import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { useContactUsMutation } from "@/store/api/splits/contact-us";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import {
  contactUsPageSchema,
  ContactUsPageSchema,
  initialFormValues,
} from "./schema";
import WhatsAppButton from "@/components/shared/whatapp-button";

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email us",
    value: "support.tuitionlanka@gmail.com",
    href: "mailto:support.tuitionlanka@gmail.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Call us",
    value: "0707491400",
    href: "tel:0707491400",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Visit us",
    value: "Colombo, Sri Lanka",
    href: null,
  },
];

const ContactUsPage = () => {
  const form = useForm<ContactUsPageSchema>({
    resolver: zodResolver(contactUsPageSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const [sendInquiry, { isLoading }] = useContactUsMutation();

  const onSubmit = async ({ name, email, contactNumber, message }: ContactUsPageSchema) => {
    const payload = {
      message,
      contactNumber,
      sender: { name, email },
    };

    const result = await sendInquiry(payload as any);
    const error = getErrorInApiResult(result);

    if (error) return toast.error(error);

    if (result.data) {
      form.reset();
      toast.success("Your message has been sent successfully!");
    }
  };

  return (
    <div className="mx-auto max-w-7xl mt-10 px-6 lg:px-8 pb-10">
      <div className="rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* ── Left panel — project navyblue → darkblue gradient ── */}
        <div className="relative flex flex-col justify-between px-10 py-12 overflow-hidden bg-gradient-to-b from-navyblue to-darkblue">
          {/* Decorative blurred circles */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue/20 blur-3xl pointer-events-none" />
          <div className="absolute top-10 -right-10 w-48 h-48 rounded-full bg-blue/10 blur-2xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-lightblue mb-3">
              Get In Touch
            </p>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Contact Us
            </h1>
            <p className="text-base text-offwhite leading-relaxed max-w-xs">
              Not sure what you need? Our team at TuitionLanka will be happy
              to listen to you and help you find the right tutor.
            </p>
          </div>

          {/* Contact info items */}
          <div className="relative z-10 flex flex-col gap-6 mt-10">
            {CONTACT_INFO.map((item) => {
              const inner = (
                <div className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-primary-700 group-hover:border-primary-700 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-lightblue uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? "_blank" : undefined}
                  rel={item.href.startsWith("mailto") ? "noopener noreferrer" : undefined}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.label}>{inner}</div>
              );
            })}
          </div>

          {/* Bottom decorative dots */}
          <div className="relative z-10 mt-10 flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary-600" : "bg-white/25"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Right panel — white form card ── */}
        <div className="relative bg-white px-10 py-12 flex flex-col justify-center overflow-hidden">
          {/* Decorative concentric rings — top right */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-[30px] border-gray-100 pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border-[20px] border-gray-50 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-black leading-snug mb-1">
              We&apos;d love to hear from you!
              <br />
              <span className="text-primary-700">Let&apos;s get in touch</span>
            </h2>
            <p className="text-sm text-darkgrey mb-8">
              Fill in the form and our team will get back to you shortly.
            </p>

            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputText
                    label="Full Name *"
                    name="name"
                    placeholder="e.g. Nimal Perera"
                  />
                  <InputText
                    label="Email *"
                    name="email"
                    placeholder="e.g. nimal@example.com"
                    type="email"
                  />
                </div>

                <InputText
                  label="Contact Number *"
                  name="contactNumber"
                  placeholder="e.g. 0771234567"
                  type="tel"
                />

                <InputMultiLineText
                  label="Message *"
                  name="message"
                  placeholder="Type your message here..."
                  rows={4}
                />

                <SubmitButton
                  title="Send Message"
                  type="submit"
                  loading={isLoading}
                />
              </form>
            </FormProvider>
          </div>
        </div>

      </div>
      <WhatsAppButton /> 
    </div>
  );
};

export default ContactUsPage;
