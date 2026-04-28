"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LogoImage from "../../../../public/images/findTutor/register.png";
import Image from "next/image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
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
  step2Schema,
  step3Schema,
} from "../schema";
import {
  useAddTutorRequestMutation,
  useLazyGetTutorEmailAvailabilityQuery,
} from "@/store/api/splits/tutor-request";
import { getErrorInApiResult } from "@/utils/api";
import { Spinner } from "@/components/ui/spinner";
import { getEmailFormatError } from "@/utils/email-validation";

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
const primaryActionButtonClassName = "bg-blue-600 text-white hover:bg-blue-700";
const DUPLICATE_EMAIL_MESSAGE = "Email already exists";

const isDuplicateEmailError = (error: string) => {
  const normalizedError = error.toLowerCase();
  return (
    normalizedError.includes("email") &&
    (normalizedError.includes("already exists") ||
      normalizedError.includes("already in use") ||
      normalizedError.includes("already taken"))
  );
};

export function TutorTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("personalInfo");
  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();
  const [checkTutorEmailAvailability] = useLazyGetTutorEmailAvailabilityQuery();
  /** null = closed | "success" = success dialog | string = error message */
  const [submissionResult, setSubmissionResult] = useState<
    "success" | string | null
  >(null);
  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      dateOfBirth: "",
      age: 0,
      gender: "",
      nationality: "",
      race: "",

      classType: [],
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

      certificatesAndQualifications: [{ type: "", url: "" }],
      agreeTerms: false,
      agreeAssignmentInfo: false,
    },
  });

  const { handleSubmit, trigger, reset, setError, setFocus, getValues } =
    methods;

  const currentIndex = TAB_ORDER.indexOf(tab);

  const changeStep = (nextTab: TabKey) => {
    setTab(nextTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = async () => {
    let fieldsToValidate: string[] | undefined;

    if (tab === "personalInfo") {
      // step1Schema uses .superRefine, so we list fields explicitly
      fieldsToValidate = [
        "fullName",
        "email",
        "password",
        "confirmPassword",
        "contactNumber",
        "dateOfBirth",
        "gender",
        "age",
        "nationality",
        "race",
      ];
    } else if (tab === "qualifications") {
      fieldsToValidate = Object.keys(step2Schema.shape);
    } else if (tab === "teachingProfile") {
      fieldsToValidate = Object.keys(step3Schema.shape);
    }

    if (fieldsToValidate) {
      const valid = await trigger(fieldsToValidate as any);
      if (!valid) return;
    }

    if (tab === "personalInfo") {
      const email = getValues("email").toLowerCase();
      const formatError = getEmailFormatError(email);
      if (formatError) {
        setError("email", {
          type: "manual",
          message: formatError,
        });
        setFocus("email");
        return;
      }

      const result = await checkTutorEmailAvailability(email, true);

      if (result.data && !result.data.available) {
        setError("email", {
          type: "server",
          message: result.data.message || DUPLICATE_EMAIL_MESSAGE,
        });
        setFocus("email");
        return;
      }
    }

    changeStep(TAB_ORDER[currentIndex + 1]);
  };

  const prevStep = () => {
    changeStep(TAB_ORDER[currentIndex - 1]);
  };

  const onSubmit = async (data: FindMyTutorForm) => {
    try {
      // Strip confirmPassword — it is front-end only and must not reach the API
      const { confirmPassword: _omit, ...payload } = data;
      const result = await addTutorRequest(payload);
      const error = getErrorInApiResult(result);
      if (error) {
        if (typeof error === "string" && isDuplicateEmailError(error)) {
          setError("email", {
            type: "server",
            message: DUPLICATE_EMAIL_MESSAGE,
          });
          changeStep("personalInfo");
          setTimeout(() => setFocus("email"), 0);
          toast.error(DUPLICATE_EMAIL_MESSAGE);
          return;
        }

        // Show a prominent toast for suspended emails, generic dialog for anything else
        if (
          typeof error === "string" &&
          error.toLowerCase().includes("suspended")
        ) {
          toast.error(
            "Your email has been suspended. Please contact admin to resolve this.",
            { duration: 8000, style: { maxWidth: 420 } },
          );
          return;
        }
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
  const agreeTerms = methods.watch("agreeTerms");
  const agreeAssignmentInfo = methods.watch("agreeAssignmentInfo");
  const isSubmitDisabled =
    isLoading ||
    !certificates ||
    certificates.length === 0 ||
    !certificates.some((c: { type: string; url: string }) => c.type && c.url) ||
    !agreeTerms ||
    !agreeAssignmentInfo;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
          <div className="text-3xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl">
            <Image height={50} width={50} src={LogoImage} alt="Logo image" />
            <h1 className="text-3xl text-white font-bold">
              Register As A Tutor
            </h1>
          </div>

          <Tabs value={tab} className="w-full">
            <TabsContent value="personalInfo">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalInfo />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={primaryActionButtonClassName}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AcademicExperience />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={primaryActionButtonClassName}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="teachingProfile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Teaching Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TutorProfile />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={primaryActionButtonClassName}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Verification & Agreement
                  </CardTitle>
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
                    className={`ml-auto ${primaryActionButtonClassName}`}
                    disabled={isSubmitDisabled}
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
      <Dialog
        open={submissionResult === "success"}
        onOpenChange={(o) => {
          if (!o) handleDone();
        }}
      >
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Registration Submitted!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Your tutor profile has been submitted successfully. Our team will
              review it and get back to you shortly.
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
        open={
          typeof submissionResult === "string" && submissionResult !== "success"
        }
        onOpenChange={(o) => {
          if (!o) setSubmissionResult(null);
        }}
      >
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Submission Failed
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {typeof submissionResult === "string"
                ? submissionResult
                : "Something went wrong."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>Try Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
