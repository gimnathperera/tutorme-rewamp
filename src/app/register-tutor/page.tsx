// If parent is server component
import dynamic from "next/dynamic";

const FindMyTutorForm = dynamic(() => import("./FindMyTutorForm"), {
  ssr: false,
});

export default function RegisterTutor() {
  return <FindMyTutorForm />;
}
