"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LogoImage from "/images/findTutor/register.png";
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
import { useTranslations, useLocale } from "next-intl";
import { translateTextsToEnglish } from "@/utils/translateToEnglish";
import {
  FindMyTutorForm,
  createFullSchema,
  STEP2_FIELDS,
  STEP3_FIELDS,
} from "../schema";
import {
  useAddTutorRequestMutation,
  useLazyGetTutorEmailAvailabilityQuery,
} from "@/store/api/splits/tutor-request";
import { useFetchSubjectsForGradesMutation } from "@/store/api/splits/grades";
import { getErrorInApiResult } from "@/utils/api";
import { Spinner } from "@/components/ui/spinner";
import { isPhysicalClassType } from "@/configs/register-tutor";

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
const ONLINE_ONLY_LOCATION_FALLBACK = "No Preference";

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
  const t = useTranslations("registerTutor");
  const locale = useLocale();
  const schema = useMemo(() => createFullSchema(t), [t]);
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("personalInfo");
  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();
  const [checkTutorEmailAvailability] = useLazyGetTutorEmailAvailabilityQuery();
  const [fetchSubjectsForGrades] = useFetchSubjectsForGradesMutation();
  /** null = closed | "success" = success dialog | string = error message */
  const [submissionResult, setSubmissionResult] = useState<
    "success" | string | null
  >(null);
  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(schema),
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
      optionalCertificates: [],
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
      fieldsToValidate = [...STEP2_FIELDS];
    } else if (tab === "teachingProfile") {
      fieldsToValidate = [...STEP3_FIELDS];
    }

    if (fieldsToValidate) {
      const valid = await trigger(fieldsToValidate as any);
      if (!valid) return;
    }

    if (tab === "qualifications") {
      const grades = getValues("grades") as string[];
      const subjects = getValues("subjects") as string[];
      const selectedSubjectSet = new Set(subjects);

      const perGradeResults = await Promise.all(
        grades.map(async (gradeId) => {
          const res = await fetchSubjectsForGrades({
            gradeIds: [gradeId],
          }).unwrap();
          return {
            gradeId,
            subjectIds: res.subjects.map((s: any) => s.id as string),
          };
        }),
      );

      const hasGradeWithoutSubject = perGradeResults.some(
        ({ subjectIds }) =>
          subjectIds.length > 0 &&
          !subjectIds.some((id) => selectedSubjectSet.has(id)),
      );

      if (hasGradeWithoutSubject) {
        setError("subjects", {
          type: "manual",
          message: t("subjectPerGradeRequired"),
        });
        return;
      }
    }

    if (tab === "personalInfo") {
      const email = getValues("email").toLowerCase();
      const result = await checkTutorEmailAvailability(email, true);

      if (result.data && !result.data.available) {
        setError("email", {
          type: "server",
          message: t("emailAlreadyExists"),
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
      // Translate free-text fields to English before sending to backend
      let processedData = data;
      if (locale !== "en") {
        const textFields = [
          "teachingSummary",
          "studentResults",
          "sellingPoints",
          "academicDetails",
        ] as const;
        const texts = textFields.map((f) => data[f] ?? "");
        const translated = await translateTextsToEnglish(texts, locale);
        processedData = {
          ...data,
          teachingSummary: translated[0] ?? data.teachingSummary,
          studentResults: translated[1] ?? data.studentResults,
          sellingPoints: translated[2] ?? data.sellingPoints,
          academicDetails: translated[3] ?? data.academicDetails,
        };
      }

      // Strip front-end-only fields before sending to API
      const {
        confirmPassword: _omit,
        optionalCertificates,
        ...payload
      } = processedData;
      const validOptional = (optionalCertificates ?? []).filter(
        (c) => c.type && c.url,
      );
      const normalizedPayload = {
        ...payload,
        certificatesAndQualifications: [
          ...payload.certificatesAndQualifications,
          ...validOptional,
        ],
        preferredLocations: payload.classType.some(isPhysicalClassType)
          ? payload.preferredLocations
          : payload.preferredLocations.length > 0
            ? payload.preferredLocations
            : [ONLINE_ONLY_LOCATION_FALLBACK],
        locale,
      };
      const result = await addTutorRequest(normalizedPayload);
      const error = getErrorInApiResult(result);
      if (error) {
        if (typeof error === "string" && isDuplicateEmailError(error)) {
          setError("email", {
            type: "server",
            message: t("emailAlreadyExists"),
          });
          changeStep("personalInfo");
          setTimeout(() => setFocus("email"), 0);
          toast.error(t("emailAlreadyExists"));
          return;
        }

        // Show a prominent toast for suspended emails, generic dialog for anything else
        if (
          typeof error === "string" &&
          error.toLowerCase().includes("suspended")
        ) {
          toast.error(t("suspendedEmail"), {
            duration: 8000,
            style: { maxWidth: 420 },
          });
          return;
        }
        setSubmissionResult(error);
        return;
      }
      setSubmissionResult("success");
    } catch {
      setSubmissionResult(t("somethingWentWrong"));
    }
  };

  /** Reset form and navigate to home on success dismiss */
  const handleDone = () => {
    setSubmissionResult(null);
    reset();
    setTab("personalInfo");
    router.push("/");
  };

  const certificates = methods.watch("certificatesAndQualifications") as { type: string; url: string }[];
  const agreeTerms = methods.watch("agreeTerms");
  const agreeAssignmentInfo = methods.watch("agreeAssignmentInfo");
  const allDocsComplete =
    certificates?.length > 0 &&
    certificates.every((c) => c.type && c.url);
  const isSubmitDisabled = isLoading || !allDocsComplete || !agreeTerms || !agreeAssignmentInfo;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
          <div className="text-3xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl">
            <Image height={50} width={50} src={LogoImage} alt={t("logoAlt")} />
            <h1 className="text-3xl text-white font-bold">{t("pageTitle")}</h1>
          </div>

          <Tabs value={tab} className="w-full">
            <TabsContent value="personalInfo">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {t("personalInfo")}
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
                    {t("next")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {t("qualifications")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AcademicExperience />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("previous")}
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={primaryActionButtonClassName}
                  >
                    {t("next")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="teachingProfile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {t("teachingProfile")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TutorProfile />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("previous")}
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={primaryActionButtonClassName}
                  >
                    {t("next")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {t("verification")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TermsAndSubmit />
                </CardContent>
                <CardFooter className="flex justify-start">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("previous")}
                  </Button>
                  <Button
                    type="submit"
                    className={`ml-auto ${primaryActionButtonClassName}`}
                    disabled={isSubmitDisabled}
                  >
                    {t("submit")} {isLoading ? <Spinner /> : ""}
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
              {t("successTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-500">
              {t("successDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-blue-700 leading-snug">
              {t("successEmail")}
            </p>
          </div>
          <DialogFooter className="justify-center mt-2">
            <Button className="w-full sm:w-auto" onClick={handleDone}>
              {t("done")}
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
              {t("errorTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {typeof submissionResult === "string"
                ? submissionResult
                : t("somethingWentWrong")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>
              {t("tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
