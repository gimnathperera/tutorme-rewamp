import React from "react";
import { TutorTabs } from "./components/TutorTabs";
import WhatsAppButton from "@/components/shared/whatapp-button";

const page = () => {
  return (
    <>
      <TutorTabs />
      <WhatsAppButton />
    </>
  );
};

export default page;
