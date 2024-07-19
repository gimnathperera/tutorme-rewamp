import Banner from "@/src/components/home-page/banner";
import Beliefs from "@/src/components/home-page/beliefs";
import KeepInTouch from "@/src/components/home-page/keep-in-touch";
import Testimonials from "@/src/components/home-page/testimonials";
import AboutUs from "@/src/components/home-page/about-us";
import OurTeam from "@/src/components/home-page/our-team";
import WeWork from "@/src/components/home-page/we-work";
import Faqs from "@/src/components/home-page/faq";
import Digital from "@/src/components/home-page/digital";

export default function Home() {
  return (
    <>
      <Banner />
      <AboutUs />
      <Digital />
      <Beliefs />
      <WeWork />
      <OurTeam />
      <Faqs />
      <Testimonials />
      <KeepInTouch />
    </>
  );
}
