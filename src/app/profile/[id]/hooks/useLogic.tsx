"use client";

import { useAuthContext } from "@/contexts";
import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/splits/users";
import { Option } from "@/types/shared-types";
import { ProfileResponse, Subject } from "@/types/response-types";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { size } from "lodash-es";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  EducationInfoSchema,
  educationInfoSchema,
  initialEducationInfoFormValues,
} from "../components/form-education-information/schema";
import {
  GeneralInfoSchema,
  generalInfoSchema,
  initialGeneralInfoFormValues,
} from "../components/form-general-information/schema";
import {
  initialLanguageAndTimeFormValues,
  LanguageOptionsSchema,
  languageOptionsSchema,
} from "../components/form-language-time/schema";
import { normalizeAvailabilityValue } from "../components/form-language-time/availability";
import {
  LogicReturnType,
  languageOptions,
  rateOptions,
  timeZoneOptions,
} from "./util";

const getProfileSubjectIds = (profile: ProfileResponse) =>
  profile.subjects.map(({ id }) => id);

const getProfileGradeIds = (profile: ProfileResponse) =>
  profile.grades.map(({ id }) => id);

const formatBirthdayForInput = (birthday?: string) =>
  birthday ? birthday.slice(0, 10) : "";

const calculateAgeFromBirthday = (birthday?: string) => {
  if (!birthday) return initialGeneralInfoFormValues.age;

  const dob = new Date(birthday);

  if (Number.isNaN(dob.getTime())) return initialGeneralInfoFormValues.age;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 0 ? age : initialGeneralInfoFormValues.age;
};

const useLogic = (): LogicReturnType => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user, isUserLoaded } = useAuthContext();

  const [userRawData, setUserRawData] = useState<ProfileResponse | null>(null);
  const [educationSubjectsOptions, setEducationSubjectsOptions] = useState<
    Option[]
  >([]);

  const [fetchProfileData, { isLoading: isProfileDataLoading }] =
    useLazyGetProfileQuery();

  const { data: gradeRawData, isLoading: isGradeLoading } = useFetchGradesQuery(
    {
      limit: 100,
      page: 1,
    },
  );

  const [fetchSubjectsByGrade] = useLazyFetchGradeByIdQuery();
  const [handleProfileSubmit, { isLoading: isGeneralFormSubmitting }] =
    useUpdateProfileMutation();

  const generalInfoForm = useForm<GeneralInfoSchema>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: initialGeneralInfoFormValues as GeneralInfoSchema,
    mode: "onChange",
  });

  const educationInfoForm = useForm<EducationInfoSchema>({
    resolver: zodResolver(educationInfoSchema),
    defaultValues: initialEducationInfoFormValues,
    mode: "onChange",
  });

  const languageAndTimeForm = useForm<LanguageOptionsSchema>({
    resolver: zodResolver(languageOptionsSchema),
    defaultValues: initialLanguageAndTimeFormValues as LanguageOptionsSchema,
    mode: "onChange",
  });

  const [selectedEducationGrades] = educationInfoForm.watch(["grades"]);

  const educationGradeSubjectsMapRef = useRef<Map<string, string[]>>(new Map());
  const prevEducationGradesRef = useRef<string[]>([]);
  const hasInitialEducationSubjectsBeenSet = useRef(false);

  const forceRedirectUser = useCallback(() => {
    if (isUserLoaded && !user) {
      router.push("/");
    }
  }, [isUserLoaded, router, user]);

  const prePopulateGeneralForm = useCallback(
    (profile: ProfileResponse) => {
      generalInfoForm.reset({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        birthday: formatBirthdayForInput(profile.birthday) as any,
        age:
          typeof profile.age === "number"
            ? profile.age
            : calculateAgeFromBirthday(profile.birthday),
        gender:
          profile.gender === "None" ? "" : ((profile.gender ?? "") as string),
        nationality: profile.nationality ?? "",
        race: profile.race ?? "",
      });
    },
    [generalInfoForm],
  );

  const prePopulateEducationForm = useCallback(
    (profile: ProfileResponse) => {
      educationInfoForm.reset({
        tutoringLevels: profile.tutoringLevels ?? [],
        preferredLocations: profile.preferredLocations ?? [],
        tutorTypes:
          profile.tutorTypes ??
          (profile.tutorType ? [profile.tutorType] : []),
        highestEducation: profile.highestEducation ?? "",
        yearsExperience:
          profile.yearsExperience ??
          initialEducationInfoFormValues.yearsExperience,
        tutorMediums: profile.tutorMediums ?? [],
        grades: getProfileGradeIds(profile),
        subjects: getProfileSubjectIds(profile),
      });
    },
    [educationInfoForm],
  );

  const prePopulateLanguageAndTimeForm = useCallback(
    (profile: ProfileResponse) => {
      languageAndTimeForm.reset({
        timeZone: profile.timeZone ?? "",
        language: profile.language ?? "",
        availability: normalizeAvailabilityValue(profile.availability),
        rate: profile.rate ?? "",
      });
    },
    [languageAndTimeForm],
  );

  const getUserRawData = useCallback(async () => {
    const result = await fetchProfileData({ userId });
    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to load profile data. Please try again later.");
      return;
    }

    if (result.data) {
      hasInitialEducationSubjectsBeenSet.current = false;

      setUserRawData(result.data);
      prePopulateGeneralForm(result.data);
      prePopulateEducationForm(result.data);
      prePopulateLanguageAndTimeForm(result.data);
    }
  }, [
    fetchProfileData,
    prePopulateEducationForm,
    prePopulateGeneralForm,
    prePopulateLanguageAndTimeForm,
    userId,
  ]);

  const syncEducationSubjectOptions = useCallback(async () => {
    const currentGrades: string[] = selectedEducationGrades ?? [];
    const prevGrades = prevEducationGradesRef.current;

    const removedGrades = prevGrades.filter(
      (gradeId) => !currentGrades.includes(gradeId),
    );

    if (removedGrades.length > 0) {
      const removedSubjectIds = new Set<string>();

      removedGrades.forEach((gradeId) => {
        (educationGradeSubjectsMapRef.current.get(gradeId) ?? []).forEach(
          (subjectId) => removedSubjectIds.add(subjectId),
        );
        educationGradeSubjectsMapRef.current.delete(gradeId);
      });

      setEducationSubjectsOptions((prev) =>
        prev.filter((option) => !removedSubjectIds.has(option.value)),
      );

      const currentSubjects = educationInfoForm.getValues("subjects") ?? [];
      educationInfoForm.setValue(
        "subjects",
        currentSubjects.filter((subjectId) => !removedSubjectIds.has(subjectId)),
        { shouldDirty: true },
      );
    }

    for (const gradeId of currentGrades) {
      if (educationGradeSubjectsMapRef.current.has(gradeId)) continue;

      const result = await fetchSubjectsByGrade(gradeId);
      const error = getErrorInApiResult(result);

      if (error) {
        toast.error(error);
        continue;
      }

      if (result.data) {
        const existingIds = new Set(
          Array.from(educationGradeSubjectsMapRef.current.values()).flat(),
        );
        const newSubjects: Subject[] = result.data.subjects.filter(
          ({ id }) => !existingIds.has(id),
        );

        educationGradeSubjectsMapRef.current.set(
          gradeId,
          result.data.subjects.map(({ id }) => id),
        );

        setEducationSubjectsOptions((prev) => [
          ...prev,
          ...newSubjects.map(({ title, id }) => ({
            label: title,
            value: id,
          })),
        ]);
      }
    }

    prevEducationGradesRef.current = currentGrades;
  }, [educationInfoForm, fetchSubjectsByGrade, selectedEducationGrades]);

  useEffect(() => {
    if (
      userRawData &&
      size(educationSubjectsOptions) > 0 &&
      !hasInitialEducationSubjectsBeenSet.current
    ) {
      educationInfoForm.setValue(
        "subjects",
        userRawData.subjects
          .filter(({ id }) =>
            educationSubjectsOptions.some((option) => option.value === id),
          )
          .map(({ id }) => id),
      );

      hasInitialEducationSubjectsBeenSet.current = true;
    }
  }, [educationInfoForm, educationSubjectsOptions, userRawData]);

  useEffect(() => {
    forceRedirectUser();
    if (!userId || !user) return;
    getUserRawData();
  }, [forceRedirectUser, getUserRawData, user, userId]);

  useEffect(() => {
    syncEducationSubjectOptions();
  }, [selectedEducationGrades, syncEducationSubjectOptions]);

  const gradesOptions =
    gradeRawData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  const onGeneralInfoFormSubmission = async (data: GeneralInfoSchema) => {
    const result = await handleProfileSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update personal information");
      return;
    }

    toast.success("Personal information updated successfully");
  };

  const onEducationInfoFormSubmission = async (data: EducationInfoSchema) => {
    const result = await handleProfileSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update qualifications");
      return;
    }

    toast.success("Qualifications updated successfully");
  };

  const onLanguageAndTimeFormSubmission = async (
    data: LanguageOptionsSchema,
  ) => {
    const result = await handleProfileSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update languages and availability");
      return;
    }

    toast.success("Languages and availability updated successfully");
  };

  return {
    derivedData: {
      dropdownOptionData: {
        gradesOptions,
        educationSubjectsOptions,
        languageOptions,
        timeZoneOptions,
        rateOptions,
      },
      loading: {
        isProfileDataLoading,
        isGradeLoading,
        isGeneralFormSubmitting,
      },
    },
    forms: {
      generalInfoForm,
      educationInfoForm,
      languageAndTimeForm,
    },
    handlers: {
      onGeneralInfoFormSubmission,
      onEducationInfoFormSubmission,
      onLanguageAndTimeFormSubmission,
    },
  };
};

export default useLogic;
