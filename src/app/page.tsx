import AboutUs from "@/components/home-page/about-us";
import Banner from "@/components/home-page/banner";
import Beliefs from "@/components/home-page/beliefs";
import Digital from "@/components/home-page/digital";
import Faqs from "@/components/home-page/faq";
import KeepInTouch from "@/components/home-page/keep-in-touch";
import OurTeam from "@/components/home-page/our-team";
import Testimonials from "@/components/home-page/testimonials";
import WhatsAppButton from "@/components/shared/whatapp-button";

export default function Home() {
  return (
    <>
      <Banner />
      <AboutUs />
      <Digital />
      <Beliefs />
      <OurTeam />
      <Faqs />
      <Testimonials />
      <KeepInTouch />
      <WhatsAppButton />
    </>
  );
}
