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
import { useCallback, useEffect, useState } from "react";
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
} from "./util";
import { Option } from "@/types/shared-types";

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
    }
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

  const [grade] = generalInfoForm.watch(["grade"]);

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
      } = profile;

      // TODO: grade should be a multi select

      generalInfoForm.setValue("name", name);
      generalInfoForm.setValue("email", email);
      generalInfoForm.setValue("phoneNumber", phoneNumber);
      generalInfoForm.setValue("country", country);
      generalInfoForm.setValue("city", city);
      generalInfoForm.setValue("state", state);
      generalInfoForm.setValue("region", region);
      generalInfoForm.setValue("zip", zip);
      generalInfoForm.setValue("address", address);
      generalInfoForm.setValue("birthday", new Date(birthday));
      generalInfoForm.setValue("duration", duration);
      generalInfoForm.setValue("frequency", frequency);
      generalInfoForm.setValue("gender", gender);
      generalInfoForm.setValue("tutorType", tutorType);
      generalInfoForm.setValue("grade", grades?.[0]?.id);
    },
    [generalInfoForm, userRawData]
  );

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
    }
  }, [fetchProfileData, prePopulateGeneralForm, userId]);

  const init = useCallback(async () => {
    await getUserRawData();
  }, [getUserRawData]);

  const handleOnGradeChangeSubjectFetch = useCallback(async () => {
    if (!grade) return;
    const result = await fetchSubjectsByGrade(grade);
    const error = getErrorInApiResult(result);

    if (error) {
      return toast.error(error);
    }

    if (result.data) {
      setSubjectsOptions(
        result.data.subjects.map(({ title, id }: Subject) => ({
          label: title,
          value: id,
        }))
      );
    }
  }, [fetchSubjectsByGrade, grade]);

  useEffect(() => {
    forceRedirectUser();
    if (!userId || !user) return;
    init();
  }, [forceRedirectUser, init, user, userId]);

  useEffect(() => {
    handleOnGradeChangeSubjectFetch();
  }, [grade, handleOnGradeChangeSubjectFetch]);

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
      },
      loading: {
        isProfileDataLoading,
        isGradeLoading,
        isGeneralFormSubmitting,
      },
    },
    forms: {
      generalInfoForm,
    },
    handlers: {
      onGeneralInfoFormSubmission,
    },
  };
};

export default useLogic;
