import AboutUs from "@/components/home-page/about-us";
import Banner from "@/components/home-page/banner";
import Beliefs from "@/components/home-page/beliefs";
import Faqs from "@/components/home-page/faq";
import KeepInTouch from "@/components/home-page/keep-in-touch";
import OurTeam from "@/components/home-page/our-team";
import Testimonials from "@/components/home-page/testimonials";
import WhatsAppButton from "@/components/shared/whatapp-button";
import ScrollAnimationProvider from "@/components/shared/scroll-animation-provider";
import JsonLd from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createOrganizationJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          createOrganizationJsonLd(),
          createBreadcrumbJsonLd([{ name: "Home", path: "/" }]),
        ]}
      />
      <ScrollAnimationProvider />
      {/* Hero banner - full screen, outside the section gap container */}
      <Banner />
      <div className="pt-8 lg:pt-12">
        <AboutUs />
        <Beliefs />
        <OurTeam />
        <Faqs />
        <Testimonials />
        <KeepInTouch />
      </div>
      <WhatsAppButton />
    </>
  );
}
