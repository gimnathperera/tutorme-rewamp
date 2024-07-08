import Aboutus from "@/src/components/Aboutus";
import Banner from "@/src/components/Banner";
import Beliefs from "@/src/components/Beliefs";
import Digital from "@/src/components/Digital";
import FAQ from "@/src/components/FAQ";
import Joinus from "@/src/components/Joinus";
import Ourteam from "@/src/components/Ourteam";
import Testimonials from "@/src/components/Testimonials";
import Wework from "@/src/components/Wework";

export default function Home() {
  return (
    <>
      <Banner />
      <Aboutus />
      <Digital />
      <Beliefs />
      <Wework />
      <Ourteam />
      <FAQ />
      <Testimonials />
      <Joinus />
    </>
  );
}
