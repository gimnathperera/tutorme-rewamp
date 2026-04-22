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
import {
  LogicReturnType,
  countryOptions,
  durationOptions,
  frequencyOptions,
  genderOptions,
  languageOptions,
  timeZoneOptions,
  tutorTypesOptions,
} from "./util";

const getProfileSubjectIds = (profile: ProfileResponse) =>
  profile.subjects.map(({ id }) => id);

const getProfileGradeIds = (profile: ProfileResponse) =>
  profile.grades.map(({ id }) => id);

const formatBirthdayForInput = (birthday?: string) =>
  birthday ? birthday.slice(0, 10) : "";

const useLogic = (): LogicReturnType => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user, isUserLoaded } = useAuthContext();

  const [userRawData, setUserRawData] = useState<ProfileResponse | null>(null);
  const [subjectsOptions, setSubjectsOptions] = useState<Option[]>([]);
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

  const [selectedGeneralGrades] = generalInfoForm.watch(["grades"]);
  const [selectedEducationGrades] = educationInfoForm.watch(["grades"]);

  const generalGradeSubjectsMapRef = useRef<Map<string, string[]>>(new Map());
  const educationGradeSubjectsMapRef = useRef<Map<string, string[]>>(new Map());
  const prevGeneralGradesRef = useRef<string[]>([]);
  const prevEducationGradesRef = useRef<string[]>([]);
  const hasInitialGeneralSubjectsBeenSet = useRef(false);
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
        country: profile.country ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        region: profile.region ?? "",
        zip: profile.zip ?? "",
        address: profile.address ?? "",
        birthday: formatBirthdayForInput(profile.birthday) as any,
        tutorType: profile.tutorType ?? "",
        gender: profile.gender ?? "",
        grades: getProfileGradeIds(profile),
        subjects: getProfileSubjectIds(profile),
        duration: profile.duration ?? "",
        frequency: profile.frequency ?? "",
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
        availability: profile.availability ?? "",
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
      hasInitialGeneralSubjectsBeenSet.current = false;
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

  const syncGeneralSubjectOptions = useCallback(async () => {
    const currentGrades: string[] = selectedGeneralGrades ?? [];
    const prevGrades = prevGeneralGradesRef.current;

    const removedGrades = prevGrades.filter(
      (gradeId) => !currentGrades.includes(gradeId),
    );

    if (removedGrades.length > 0) {
      const removedSubjectIds = new Set<string>();

      removedGrades.forEach((gradeId) => {
        (generalGradeSubjectsMapRef.current.get(gradeId) ?? []).forEach(
          (subjectId) => removedSubjectIds.add(subjectId),
        );
        generalGradeSubjectsMapRef.current.delete(gradeId);
      });

      setSubjectsOptions((prev) =>
        prev.filter((option) => !removedSubjectIds.has(option.value)),
      );

      const currentSubjects = generalInfoForm.getValues("subjects") ?? [];
      generalInfoForm.setValue(
        "subjects",
        currentSubjects.filter((subjectId) => !removedSubjectIds.has(subjectId)),
        { shouldDirty: true },
      );
    }

    for (const gradeId of currentGrades) {
      if (generalGradeSubjectsMapRef.current.has(gradeId)) continue;

      const result = await fetchSubjectsByGrade(gradeId);
      const error = getErrorInApiResult(result);

      if (error) {
        toast.error(error);
        continue;
      }

      if (result.data) {
        const existingIds = new Set(
          Array.from(generalGradeSubjectsMapRef.current.values()).flat(),
        );
        const newSubjects: Subject[] = result.data.subjects.filter(
          ({ id }) => !existingIds.has(id),
        );

        generalGradeSubjectsMapRef.current.set(
          gradeId,
          result.data.subjects.map(({ id }) => id),
        );

        setSubjectsOptions((prev) => [
          ...prev,
          ...newSubjects.map(({ title, id }) => ({
            label: title,
            value: id,
          })),
        ]);
      }
    }

    prevGeneralGradesRef.current = currentGrades;
  }, [fetchSubjectsByGrade, generalInfoForm, selectedGeneralGrades]);

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
      size(subjectsOptions) > 0 &&
      !hasInitialGeneralSubjectsBeenSet.current
    ) {
      generalInfoForm.setValue(
        "subjects",
        userRawData.subjects
          .filter(({ id }) => subjectsOptions.some((option) => option.value === id))
          .map(({ id }) => id),
      );

      hasInitialGeneralSubjectsBeenSet.current = true;
    }
  }, [generalInfoForm, subjectsOptions, userRawData]);

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
    syncGeneralSubjectOptions();
  }, [selectedGeneralGrades, syncGeneralSubjectOptions]);

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
      toast.error("Failed to update settings");
      return;
    }

    toast.success("Settings updated successfully");
  };

  const onEducationInfoFormSubmission = async (data: EducationInfoSchema) => {
    const result = await handleProfileSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update settings");
      return;
    }

    toast.success("Settings updated successfully");
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
      toast.error("Failed to update settings");
      return;
    }

    toast.success("Settings updated successfully");
  };

  return {
    derivedData: {
      dropdownOptionData: {
        gradesOptions,
        subjectsOptions,
        educationSubjectsOptions,
        durationOptions,
        frequencyOptions,
        tutorTypesOptions,
        genderOptions,
        countryOptions,
        languageOptions,
        timeZoneOptions,
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
