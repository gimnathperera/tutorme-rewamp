"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("personalInfo");
  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();
  /** null = closed | "success" = success dialog | string = error message */
  const [submissionResult, setSubmissionResult] = useState<"success" | string | null>(null);
  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      dateOfBirth: "",
      age: 0,
      gender: "",
      nationality: "",
      race: "",

      tutoringLevels: [],
      preferredLocations: [],
      tutorType: [],
      tutorMediums: [],
      highestEducation: "",
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
      if (error) {
        setSubmissionResult(error);
        return;
      }
      setSubmissionResult("success");
    } catch {
      setSubmissionResult("Something went wrong. Please try again.");
    }
  };

  /** Reset form and navigate to home on success dismiss */
  const handleDone = () => {
    setSubmissionResult(null);
    reset();
    setTab("personalInfo");
    router.push("/");
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

      {/* ── Success Dialog ── */}
      <Dialog open={submissionResult === "success"} onOpenChange={(o) => { if (!o) handleDone(); }}>
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Registration Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your tutor profile has been submitted successfully. Our team will review it and get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button className="w-full sm:w-auto" onClick={handleDone}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Error Dialog ── */}
      <Dialog
        open={typeof submissionResult === "string" && submissionResult !== "success"}
        onOpenChange={(o) => { if (!o) setSubmissionResult(null); }}
      >
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Submission Failed</DialogTitle>
            <DialogDescription className="text-center">
              Something went wrong.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
