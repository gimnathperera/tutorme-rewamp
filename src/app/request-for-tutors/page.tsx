import React from "react";
import AddRequestForTutorPage from "./create-request/page";
import WhatsAppButton from "@/components/shared/whatapp-button";
//import RequestTutorTabs from './components/requestTutorTabs';

const RequestForTutorsPage = () => {
  return (
    <div>
      <AddRequestForTutorPage />
      {/* <RequestTutorTabs /> */}
      <WhatsAppButton />
    </div>
    
  );
};

export default RequestForTutorsPage;
