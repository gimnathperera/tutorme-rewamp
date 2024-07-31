import AboutUs from "@/src/components/home-page/about-us";
import Banner from "@/src/components/home-page/banner";
import Beliefs from "@/src/components/home-page/beliefs";
import Digital from "@/src/components/home-page/digital";
import Faqs from "@/src/components/home-page/faq";
import KeepInTouch from "@/src/components/home-page/keep-in-touch";
import OurTeam from "@/src/components/home-page/our-team";
import Testimonials from "@/src/components/home-page/testimonials";

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
    </>
  );
}
