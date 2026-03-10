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
import { ProfileResponse, Subject } from "@/types/response-types";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  GeneralInfoSchema,
  generalInfoSchema,
  initialGeneralInfoFormValues,
} from "../components/form-general-information/schema";
import {
  LogicReturnType,
  durationOptions,
  frequencyOptions,
  tutorTypesOptions,
  genderOptions,
  countryOptions,
  languageOptions,
  timeZoneOptions,
} from "./util";
import { Option } from "@/types/shared-types";
import { size } from "lodash-es";
import {
  initialLanguageAndTimeFormValues,
  LanguageOptionsSchema,
  languageOptionsSchema,
} from "../components/form-language-time/schema";

const useLogic = (): LogicReturnType => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user, isUserLoaded } = useAuthContext();
  const [userRawData, setUserRawData] = useState<ProfileResponse | null>(null);
  const [subjectsOptions, setSubjectsOptions] = useState<Option[]>([]);

  const [fetchProfileData, { isLoading: isProfileDataLoading }] =
    useLazyGetProfileQuery();

  const { data: gradeRawData, isLoading: isGradeLoading } = useFetchGradesQuery(
    {
      limit: 100,
      page: 1,
    },
  );

  const [fetchSubjectsByGrade] = useLazyFetchGradeByIdQuery();
  const [handleGeneralInfoFormSubmit, { isLoading: isGeneralFormSubmitting }] =
    useUpdateProfileMutation();

  // TODO: may be find a better way to handle this
  const forceRedirectUser = useCallback(() => {
    if (isUserLoaded && !user) {
      router.push("/");
      return;
    }
  }, [isUserLoaded, router, user]);

  const generalInfoForm = useForm<GeneralInfoSchema>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: initialGeneralInfoFormValues as GeneralInfoSchema,
    mode: "onChange",
  });

  const languageAndTimeForm = useForm({
    resolver: zodResolver(languageOptionsSchema),
    defaultValues: initialLanguageAndTimeFormValues as LanguageOptionsSchema,
    mode: "onChange",
  });

  const [grades] = generalInfoForm.watch(["grades"]);
  /** Tracks which subject IDs belong to each grade: gradeId → Set<subjectId> */
  const gradeSubjectsMapRef = useRef<Map<string, string[]>>(new Map());
  /** Snapshot of grades from the previous render, used to detect removals */
  const prevGradesRef = useRef<string[]>([]);

  const prePopulateGeneralForm = useCallback(
    (profile: ProfileResponse) => {
      if (!userRawData) return;
      const {
        name,
        email,
        phoneNumber,
        country,
        city,
        state,
        region,
        zip,
        address,
        birthday,
        duration,
        frequency,
        gender,
        tutorType,
        grades,
        subjects,
      } = profile;

      generalInfoForm.setValue("name", name);
      generalInfoForm.setValue("email", email);
      generalInfoForm.setValue("phoneNumber", phoneNumber);
      generalInfoForm.setValue("country", country);
      generalInfoForm.setValue("city", city);
      generalInfoForm.setValue("state", state);
      generalInfoForm.setValue("region", region);
      generalInfoForm.setValue("zip", zip);
      generalInfoForm.setValue("address", address);
      generalInfoForm.setValue("birthday", birthday ? new Date(birthday) : "");
      generalInfoForm.setValue("duration", duration);
      generalInfoForm.setValue("frequency", frequency);
      generalInfoForm.setValue("gender", gender);
      generalInfoForm.setValue(
        "subjects",
        subjects.map((subject) => subject.id),
      );
      generalInfoForm.setValue("tutorType", tutorType);
      generalInfoForm.setValue(
        "grades",
        grades.map((grade) => grade.id),
      );
    },

    [generalInfoForm, userRawData],
  );

  const prePopulateLanguageAndTimeForm = useCallback(
    (profile: ProfileResponse) => {
      if (!userRawData) return;
      const { timeZone, language } = profile;

      languageAndTimeForm.setValue("timeZone", timeZone);
      languageAndTimeForm.setValue("language", language);
    },
    [languageAndTimeForm, userRawData],
  );

  // Rechecks and revalidate subject prepopulated data, since the subjects options are fetched asynchronously
  useEffect(() => {
    if (userRawData && size(subjectsOptions) > 0) {
      const { subjects } = userRawData;

      generalInfoForm.setValue(
        "subjects",
        subjects
          .filter(({ id }) =>
            subjectsOptions.some((option) => option.value === id),
          )
          .map((subject) => subject.id),
      );
    }
  }, [userRawData, subjectsOptions, generalInfoForm]);

  const getUserRawData = useCallback(async () => {
    const result = await fetchProfileData({ userId });
    const error = getErrorInApiResult(result);
    if (error) {
      toast.error("Failed to load profile data. Please try again later.");
      return;
    }
    if (result.data) {
      setUserRawData(result.data);
      prePopulateGeneralForm(result.data);
      prePopulateLanguageAndTimeForm(result.data);
    }
  }, [
    fetchProfileData,
    prePopulateGeneralForm,
    prePopulateLanguageAndTimeForm,
    userId,
  ]);

  const init = useCallback(async () => {
    await getUserRawData();
  }, [getUserRawData]);

  const handleOnGradeChangeSubjectFetch = useCallback(async () => {
    const currentGrades: string[] = grades ?? [];
    const prevGrades = prevGradesRef.current;

    // ── Handle removed grades ──────────────────────────────────────────────
    const removedGrades = prevGrades.filter(
      (id) => !currentGrades.includes(id),
    );
    if (removedGrades.length > 0) {
      // Collect all subject IDs that belong to removed grades
      const removedSubjectIds = new Set<string>();
      removedGrades.forEach((gradeId) => {
        (gradeSubjectsMapRef.current.get(gradeId) ?? []).forEach((sid) =>
          removedSubjectIds.add(sid),
        );
        gradeSubjectsMapRef.current.delete(gradeId);
      });

      // Remove those subjects from the options list
      setSubjectsOptions((prev) =>
        prev.filter((opt) => !removedSubjectIds.has(opt.value)),
      );

      // Remove those subjects from the form's selected subjects
      const currentSubjects: string[] =
        generalInfoForm.getValues("subjects") ?? [];
      generalInfoForm.setValue(
        "subjects",
        currentSubjects.filter((sid) => !removedSubjectIds.has(sid)),
        { shouldDirty: true },
      );
    }

    // ── Handle added grades ────────────────────────────────────────────────
    for (const gradeId of currentGrades) {
      if (gradeSubjectsMapRef.current.has(gradeId)) continue; // already fetched

      const result = await fetchSubjectsByGrade(gradeId);
      const error = getErrorInApiResult(result);

      if (error) {
        toast.error(error);
        continue;
      }

      if (result.data) {
        const existingIds = new Set(
          Array.from(gradeSubjectsMapRef.current.values()).flat(),
        );
        const newSubjects: Subject[] = result.data.subjects.filter(
          ({ id }: Subject) => !existingIds.has(id),
        );

        gradeSubjectsMapRef.current.set(
          gradeId,
          result.data.subjects.map(({ id }: Subject) => id),
        );

        setSubjectsOptions((prev) => [
          ...prev,
          ...newSubjects.map(({ title, id }: Subject) => ({
            label: title,
            value: id,
          })),
        ]);
      }
    }

    prevGradesRef.current = currentGrades;
  }, [fetchSubjectsByGrade, grades, generalInfoForm]);

  useEffect(() => {
    forceRedirectUser();
    if (!userId || !user) return;
    init();
  }, [forceRedirectUser, init, user, userId]);

  useEffect(() => {
    handleOnGradeChangeSubjectFetch();
  }, [grades, handleOnGradeChangeSubjectFetch]);

  const gradesOptions =
    gradeRawData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  const onGeneralInfoFormSubmission = async (data: GeneralInfoSchema) => {
    const result = await handleGeneralInfoFormSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update settings");
    }

    if (result.data) {
      toast.success("Settings updated successfully");
    }
  };

  const onLanguageAndTimeFormSubmission = async (
    data: LanguageOptionsSchema,
  ) => {
    const result = await handleGeneralInfoFormSubmit({
      id: userId,
      payload: data,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update settings");
    }

    if (result.data) {
      toast.success("Settings updated successfully");
    }
  };

  return {
    derivedData: {
      dropdownOptionData: {
        gradesOptions,
        subjectsOptions,
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
      languageAndTimeForm,
    },
    handlers: {
      onGeneralInfoFormSubmission,
      onLanguageAndTimeFormSubmission,
    },
  };
};

export default useLogic;
