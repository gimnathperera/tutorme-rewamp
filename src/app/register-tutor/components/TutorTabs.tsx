"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import LogoImage from "../../../../public/images/findTutor/register.png";
import Image from "next/image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PersonalInfo from "./PersonalInfo";
import AcademicExperience from "./AcademicExperience";
import TutorProfile from "./TutorProfile";
import TermsAndSubmit from "./TermsAndSubmit";
import {
  FindMyTutorForm,
  fullSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from "../schema";
import { useAddTutorRequestMutation } from "@/store/api/splits/tutor-request";
import { getErrorInApiResult } from "@/utils/api";
import { Spinner } from "@/components/ui/spinner";

type TabKey =
  | "personalInfo"
  | "qualifications"
  | "teachingProfile"
  | "verification";

const TAB_ORDER: TabKey[] = [
  "personalInfo",
  "qualifications",
  "teachingProfile",
  "verification",
];

export function TutorTabs() {
  const [tab, setTab] = useState<TabKey>("personalInfo");
  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();
  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      dateOfBirth: "",
      age: 0,
      gender: undefined,
      nationality: undefined,
      race: undefined,

      tutoringLevels: [],
      preferredLocations: [],
      tutorType: [],
      tutorMediums: [],
      highestEducation: undefined,
      grades: [],
      subjects: [],
      yearsExperience: 0,

      teachingSummary: "",
      studentResults: "",
      sellingPoints: "",
      academicDetails: "",

      certificatesAndQualifications: [],
      agreeTerms: false,
      agreeAssignmentInfo: false,
    },
  });

  const { handleSubmit, trigger, reset } = methods;

  const currentIndex = TAB_ORDER.indexOf(tab);

  const nextStep = async () => {
    let schema;
    if (tab === "personalInfo") schema = step1Schema;
    if (tab === "qualifications") schema = step2Schema;
    if (tab === "teachingProfile") schema = step3Schema;

    if (schema) {
      const valid = await trigger(Object.keys(schema.shape) as any);
      if (!valid) return;
    }

    setTab(TAB_ORDER[currentIndex + 1]);
  };

  const prevStep = () => {
    setTab(TAB_ORDER[currentIndex - 1]);
  };

  const onSubmit = async (data: FindMyTutorForm) => {
    try {
      const result = await addTutorRequest(data);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);
      toast.success("Tutor profile submitted successfully!");
      reset();
      setTab("personalInfo");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const certificates = methods.watch("certificatesAndQualifications");
  const isSubmitDisabled = !certificates || certificates.length === 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
          <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl">
            <Image height={50} width={50} src={LogoImage} alt="Logo image" />
            <h1>Register As A Tutor</h1>
          </div>

          <Tabs value={tab} className="w-full">
            <TabsContent value="personalInfo">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalInfo />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications">
              <Card>
                <CardHeader>
                  <CardTitle>Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <AcademicExperience />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="teachingProfile">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <TutorProfile />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Verification & Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                  <TermsAndSubmit />
                </CardContent>
                <CardFooter className="flex justify-start">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="ml-auto"
                    disabled={isLoading || isSubmitDisabled}
                  >
                    Submit {isLoading ? <Spinner /> : ""}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </FormProvider>
  );
}
