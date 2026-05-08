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
import { useLazyGetTutorRegistrationQuery } from "@/store/api/splits/tutor-request";
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
  initialTeachingProfileFormValues,
  teachingProfileSchema,
  TeachingProfileSchema,
} from "../components/form-teaching-profile/schema";
import { normalizeAvailabilityValue } from "../components/form-language-time/availability";
import {
  LogicReturnType,
  languageOptions,
  rateOptions,
  timeZoneOptions,
} from "./util";

type ProfileEntity = { id?: string; _id?: string };
type ProfileLike = Partial<ProfileResponse> & Record<string, any>;

const getEntityIds = (entities?: Array<string | ProfileEntity>) =>
  (entities ?? [])
    .map((entity) => {
      if (typeof entity === "string") return entity;
      return entity.id ?? entity._id ?? "";
    })
    .filter(Boolean);

const getProfileSubjectIds = (profile: ProfileResponse) =>
  getEntityIds(profile.subjects as any);

const getProfileGradeIds = (profile: ProfileResponse) =>
  getEntityIds(profile.grades as any);

const MONTH_BY_SHORT_NAME: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const formatDatePartsForInput = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const formatBirthdayForInput = (birthday?: string | Date) => {
  if (!birthday) return "";

  if (birthday instanceof Date) {
    if (Number.isNaN(birthday.getTime())) return "";

    return formatDatePartsForInput(
      birthday.getFullYear(),
      birthday.getMonth() + 1,
      birthday.getDate(),
    );
  }

  const trimmedBirthday = birthday.trim();
  const isoDateMatch = trimmedBirthday.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDateMatch) {
    return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`;
  }

  const legacyDateMatch = trimmedBirthday.match(
    /^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/,
  );

  if (legacyDateMatch) {
    const [, monthName, day, year] = legacyDateMatch;
    const month = MONTH_BY_SHORT_NAME[monthName];

    return month ? `${year}-${month}-${day.padStart(2, "0")}` : "";
  }

  const parsedBirthday = new Date(trimmedBirthday);
  if (Number.isNaN(parsedBirthday.getTime())) return "";

  return formatDatePartsForInput(
    parsedBirthday.getFullYear(),
    parsedBirthday.getMonth() + 1,
    parsedBirthday.getDate(),
  );
};

const getProfileBirthday = (profile: ProfileResponse) =>
  profile.birthday || profile.dateOfBirth || "";

const getProfileDisplayName = (profile: ProfileResponse) =>
  profile.name || profile.fullName || "";

const serializeBirthdayForPayload = (
  birthday: GeneralInfoSchema["birthday"],
) =>
  birthday instanceof Date ? birthday.toISOString().slice(0, 10) : birthday;

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

const normalizeTutorTypeValues = (profile: ProfileResponse) => {
  if (Array.isArray(profile.tutorTypes) && profile.tutorTypes.length > 0) {
    return profile.tutorTypes;
  }

  if (Array.isArray(profile.tutorType)) {
    return profile.tutorType;
  }

  return profile.tutorType ? [profile.tutorType] : [];
};

const normalizeArrayValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return typeof value === "string" && value ? [value] : [];
};

const preferFilledString = (
  primary: unknown,
  fallback: unknown,
  finalFallback = "",
) => {
  if (typeof primary === "string" && primary.trim().length > 0) {
    return primary;
  }

  if (typeof fallback === "string" && fallback.trim().length > 0) {
    return fallback;
  }

  return finalFallback;
};

const preferFilledOptionalString = (primary: unknown, fallback: unknown) => {
  const value = preferFilledString(primary, fallback);
  return value || undefined;
};

const preferFilledArray = <T,>(primary: T[] | undefined, fallback: T[] = []) =>
  Array.isArray(primary) && primary.length > 0 ? primary : fallback;

const normalizeGender = (
  value: unknown,
): ProfileResponse["gender"] | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "male") return "Male";
  if (normalizedValue === "female") return "Female";
  if (normalizedValue === "others" || normalizedValue === "other") {
    return "Others";
  }
};

const normalizeCertificateUrls = (
  certificates: ProfileResponse["certificatesAndQualifications"],
) =>
  (certificates ?? [])
    .map((certificate) =>
      typeof certificate === "string" ? certificate : certificate.url,
    )
    .filter((url): url is string => Boolean(url));

const hasTutorRegistrationFields = (candidate: ProfileLike) =>
  Boolean(
    candidate.fullName ||
    candidate.contactNumber ||
    candidate.dateOfBirth ||
    normalizeGender(candidate.gender) ||
    candidate.classType ||
    candidate.preferredLocations ||
    candidate.tutorType ||
    candidate.tutorTypes ||
    candidate.tutorMediums ||
    candidate.highestEducation ||
    candidate.teachingSummary ||
    candidate.studentResults ||
    candidate.sellingPoints ||
    candidate.academicDetails ||
    candidate.certificatesAndQualifications,
  );

const resolveTutorRegistrationData = (
  response: unknown,
  profile: ProfileResponse,
): ProfileLike | null => {
  if (!response || typeof response !== "object") return null;

  const data = response as ProfileLike;
  const candidates = [
    data,
    data.tutor,
    data.tutorProfile,
    data.profile,
    data.data,
    data.data?.tutor,
    data.data?.profile,
  ].filter(Boolean) as ProfileLike[];

  const collection = Array.isArray(data)
    ? data
    : Array.isArray(data.results)
      ? data.results
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.results)
          ? data.data.results
          : [];

  const isProfileMatch = (item: ProfileLike) => {
    const itemUserId = item.userId ?? item.user?.id ?? item.user?._id;
    return (
      item.email === profile.email ||
      String(itemUserId ?? "") === String(profile.id)
    );
  };

  const matchedFromCollection = collection.find(
    (item: ProfileLike) =>
      isProfileMatch(item) && hasTutorRegistrationFields(item),
  );

  if (matchedFromCollection) return matchedFromCollection;

  return (
    candidates.find(
      (candidate) =>
        hasTutorRegistrationFields(candidate) &&
        (isProfileMatch(candidate) ||
          candidate.fullName ||
          candidate.classType ||
          candidate.teachingSummary),
    ) ?? null
  );
};

const mergeTutorRegistrationIntoProfile = (
  profile: ProfileResponse,
  tutorRegistration: unknown,
): ProfileResponse => {
  const registration = resolveTutorRegistrationData(tutorRegistration, profile);
  if (!registration) return profile;

  return {
    ...profile,
    fullName: preferFilledOptionalString(
      profile.fullName,
      registration.fullName,
    ),
    name: preferFilledString(
      profile.name,
      registration.fullName || registration.name,
    ),
    contactNumber:
      profile.contactNumber ??
      registration.contactNumber ??
      registration.phoneNumber,
    phoneNumber: preferFilledString(
      profile.phoneNumber,
      registration.phoneNumber || registration.contactNumber,
    ),
    dateOfBirth: profile.dateOfBirth ?? registration.dateOfBirth,
    birthday: preferFilledString(
      profile.birthday,
      registration.birthday || registration.dateOfBirth,
    ),
    age: profile.age ?? registration.age,
    gender:
      profile.gender === "None" || !profile.gender
        ? (normalizeGender(registration.gender) ?? "None")
        : profile.gender,
    nationality: preferFilledOptionalString(
      profile.nationality,
      registration.nationality,
    ),
    race: preferFilledOptionalString(profile.race, registration.race),
    classType: preferFilledArray(
      profile.classType,
      registration.classType ?? registration.tutoringLevels ?? [],
    ),
    tutoringLevels: preferFilledArray(
      profile.tutoringLevels,
      registration.tutoringLevels ?? registration.classType ?? [],
    ),
    preferredLocations: preferFilledArray(
      profile.preferredLocations,
      registration.preferredLocations ?? [],
    ),
    tutorType: profile.tutorType ?? registration.tutorType,
    tutorTypes: preferFilledArray(
      profile.tutorTypes,
      registration.tutorTypes ?? normalizeArrayValue(registration.tutorType),
    ),
    highestEducation: preferFilledOptionalString(
      profile.highestEducation,
      registration.highestEducation,
    ),
    yearsExperience: profile.yearsExperience ?? registration.yearsExperience,
    tutorMediums: preferFilledArray(
      profile.tutorMediums,
      registration.tutorMediums ?? [],
    ),
    grades: profile.grades?.length
      ? profile.grades
      : (registration.grades ?? []),
    subjects: profile.subjects?.length
      ? profile.subjects
      : (registration.subjects ?? []),
    teachingSummary: preferFilledOptionalString(
      profile.teachingSummary,
      registration.teachingSummary,
    ),
    academicDetails: preferFilledOptionalString(
      profile.academicDetails,
      registration.academicDetails,
    ),
    studentResults: preferFilledOptionalString(
      profile.studentResults,
      registration.studentResults,
    ),
    sellingPoints: preferFilledOptionalString(
      profile.sellingPoints,
      registration.sellingPoints,
    ),
    certificatesAndQualifications: profile.certificatesAndQualifications?.length
      ? profile.certificatesAndQualifications
      : registration.certificatesAndQualifications,
  };
};

const mergeProfileUpdates = (
  currentProfile: ProfileResponse | null,
  ...updates: Array<Partial<ProfileResponse> | Record<string, unknown> | null>
) => {
  const mergedProfile = updates.reduce(
    (profile, update) => ({ ...profile, ...(update ?? {}) }),
    { ...(currentProfile ?? {}) } as ProfileResponse,
  );

  return mergedProfile as ProfileResponse;
};

const preferFilledProfileArray = <T,>(
  incoming: T[] | undefined,
  existing: T[] | undefined,
) => (Array.isArray(incoming) && incoming.length > 0 ? incoming : existing);

const preferFilledProfileString = (
  incoming: string | undefined,
  existing: string | undefined,
) =>
  typeof incoming === "string" && incoming.trim().length > 0
    ? incoming
    : existing;

const mergeHydratedProfile = (
  currentProfile: ProfileResponse | null,
  incomingProfile: ProfileResponse,
) => {
  if (!currentProfile) return incomingProfile;

  return {
    ...currentProfile,
    ...incomingProfile,
    classType: preferFilledProfileArray(
      incomingProfile.classType,
      currentProfile.classType,
    ),
    tutoringLevels: preferFilledProfileArray(
      incomingProfile.tutoringLevels,
      currentProfile.tutoringLevels,
    ),
    preferredLocations: incomingProfile.classType?.some((classType) =>
      classType.startsWith("Online"),
    )
      ? (incomingProfile.preferredLocations ?? [])
      : preferFilledProfileArray(
          incomingProfile.preferredLocations,
          currentProfile.preferredLocations,
        ),
    tutorTypes: preferFilledProfileArray(
      incomingProfile.tutorTypes,
      currentProfile.tutorTypes,
    ),
    tutorMediums: preferFilledProfileArray(
      incomingProfile.tutorMediums,
      currentProfile.tutorMediums,
    ),
    grades: preferFilledProfileArray(
      incomingProfile.grades,
      currentProfile.grades,
    ),
    subjects: preferFilledProfileArray(
      incomingProfile.subjects,
      currentProfile.subjects,
    ),
    certificatesAndQualifications: preferFilledProfileArray(
      incomingProfile.certificatesAndQualifications,
      currentProfile.certificatesAndQualifications,
    ),
    highestEducation: preferFilledProfileString(
      incomingProfile.highestEducation,
      currentProfile.highestEducation,
    ),
    teachingSummary: preferFilledProfileString(
      incomingProfile.teachingSummary,
      currentProfile.teachingSummary,
    ),
    academicDetails: preferFilledProfileString(
      incomingProfile.academicDetails,
      currentProfile.academicDetails,
    ),
    studentResults: preferFilledProfileString(
      incomingProfile.studentResults,
      currentProfile.studentResults,
    ),
    sellingPoints: preferFilledProfileString(
      incomingProfile.sellingPoints,
      currentProfile.sellingPoints,
    ),
  } as ProfileResponse;
};

const useLogic = (): LogicReturnType => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user, isUserLoaded, updateUser } = useAuthContext();

  const [userRawData, setUserRawData] = useState<ProfileResponse | null>(null);
  const userRawDataRef = useRef<ProfileResponse | null>(null);
  const [educationSubjectsOptions, setEducationSubjectsOptions] = useState<
    Option[]
  >([]);

  const [fetchProfileData, { isLoading: isProfileDataLoading }] =
    useLazyGetProfileQuery();
  const [fetchTutorRegistration] = useLazyGetTutorRegistrationQuery();

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

  const teachingProfileForm = useForm<TeachingProfileSchema>({
    resolver: zodResolver(teachingProfileSchema),
    defaultValues: initialTeachingProfileFormValues,
    mode: "onChange",
  });

  const [selectedEducationGrades] = educationInfoForm.watch(["grades"]);

  const educationGradeSubjectsMapRef = useRef<Map<string, string[]>>(new Map());
  const prevEducationGradesRef = useRef<string[]>([]);
  const hasInitialEducationSubjectsBeenSet = useRef(false);
  const currentUserId = user?.id;
  const userRole = user?.role;
  const hasUser = Boolean(user);
  const isCurrentUserProfile =
    Boolean(userId && currentUserId) &&
    String(currentUserId) === String(userId);
  const isAdminProfile = isCurrentUserProfile && userRole === "admin";

  const setProfileSnapshot = useCallback((profile: ProfileResponse) => {
    userRawDataRef.current = profile;
    setUserRawData(profile);
  }, []);

  const forceRedirectUser = useCallback(() => {
    if (isUserLoaded && !hasUser) {
      router.push("/");
      return;
    }

    if (!isUserLoaded || !hasUser) {
      return;
    }

    if (userRole === "admin" && isCurrentUserProfile) {
      return;
    }

    if (userRole !== "tutor" || !isCurrentUserProfile) {
      router.push("/");
    }
  }, [hasUser, isCurrentUserProfile, isUserLoaded, router, userRole]);

  const prePopulateGeneralForm = useCallback(
    (profile: ProfileResponse) => {
      const birthday = getProfileBirthday(profile);

      generalInfoForm.reset({
        name: getProfileDisplayName(profile),
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber || profile.contactNumber || "",
        birthday: formatBirthdayForInput(birthday) as any,
        age:
          typeof profile.age === "number"
            ? profile.age
            : calculateAgeFromBirthday(birthday),
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
      const profileClassType = normalizeArrayValue(profile.classType);
      const classType = profileClassType.length
        ? profileClassType
        : normalizeArrayValue(profile.tutoringLevels);

      educationInfoForm.reset({
        classType,
        preferredLocations: profile.preferredLocations ?? [],
        tutorTypes: normalizeTutorTypeValues(profile),
        highestEducation: profile.highestEducation ?? "",
        yearsExperience:
          profile.yearsExperience ??
          initialEducationInfoFormValues.yearsExperience,
        tutorMediums: profile.tutorMediums ?? [],
        grades: getProfileGradeIds(profile),
        subjects: getProfileSubjectIds(profile),
        certificatesAndQualifications: normalizeCertificateUrls(
          profile.certificatesAndQualifications,
        ),
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

  const prePopulateTeachingProfileForm = useCallback(
    (profile: ProfileResponse) => {
      teachingProfileForm.reset({
        teachingSummary: profile.teachingSummary ?? "",
        academicDetails: profile.academicDetails ?? "",
        studentResults: profile.studentResults ?? "",
        sellingPoints: profile.sellingPoints ?? "",
      });
    },
    [teachingProfileForm],
  );

  const hydrateProfileForms = useCallback(
    (profile: ProfileResponse) => {
      hasInitialEducationSubjectsBeenSet.current = false;
      setProfileSnapshot(profile);
      prePopulateGeneralForm(profile);
      prePopulateEducationForm(profile);
      prePopulateLanguageAndTimeForm(profile);
      prePopulateTeachingProfileForm(profile);
    },
    [
      prePopulateEducationForm,
      prePopulateGeneralForm,
      prePopulateLanguageAndTimeForm,
      prePopulateTeachingProfileForm,
      setProfileSnapshot,
    ],
  );

  const getUserRawData = useCallback(async () => {
    const result = await fetchProfileData({ userId });
    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to load profile data. Please try again later.");
      return;
    }

    if (result.data) {
      let profileData = result.data;

      if (userRole === "tutor" && profileData.email) {
        const tutorRegistrationResult = await fetchTutorRegistration({
          userId,
          email: profileData.email,
        });

        if (tutorRegistrationResult.data) {
          profileData = mergeTutorRegistrationIntoProfile(
            profileData,
            tutorRegistrationResult.data,
          );
        }
      }

      hydrateProfileForms(
        mergeHydratedProfile(userRawDataRef.current, profileData),
      );
    }
  }, [
    fetchProfileData,
    fetchTutorRegistration,
    hydrateProfileForms,
    userId,
    userRole,
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

      // Keep subjects that still belong to a remaining selected grade
      currentGrades.forEach((gradeId) => {
        (educationGradeSubjectsMapRef.current.get(gradeId) ?? []).forEach(
          (subjectId) => removedSubjectIds.delete(subjectId),
        );
      });

      setEducationSubjectsOptions((prev) =>
        prev.filter((option) => !removedSubjectIds.has(option.value)),
      );

      const currentSubjects = educationInfoForm.getValues("subjects") ?? [];
      educationInfoForm.setValue(
        "subjects",
        currentSubjects.filter(
          (subjectId) => !removedSubjectIds.has(subjectId),
        ),
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
        getProfileSubjectIds(userRawData).filter((subjectId) =>
          educationSubjectsOptions.some((option) => option.value === subjectId),
        ),
      );

      hasInitialEducationSubjectsBeenSet.current = true;
    }
  }, [educationInfoForm, educationSubjectsOptions, userRawData]);

  useEffect(() => {
    forceRedirectUser();
    if (
      !userId ||
      !hasUser ||
      !isCurrentUserProfile ||
      (userRole !== "tutor" && userRole !== "admin")
    ) {
      return;
    }
    getUserRawData();
  }, [
    currentUserId,
    forceRedirectUser,
    getUserRawData,
    hasUser,
    isCurrentUserProfile,
    userId,
    userRole,
  ]);

  useEffect(() => {
    syncEducationSubjectOptions();
  }, [selectedEducationGrades, syncEducationSubjectOptions]);

  const gradesOptions =
    gradeRawData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  const onGeneralInfoFormSubmission = async (data: GeneralInfoSchema) => {
    const birthday = serializeBirthdayForPayload(data.birthday);
    const submittedProfileUpdates = {
      ...data,
      birthday,
      name: data.name,
      fullName: data.name,
      contactNumber: data.phoneNumber,
      dateOfBirth: birthday,
    };

    const result = await handleProfileSubmit({
      id: userId,
      payload: submittedProfileUpdates,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update personal information");
      return;
    }

    const updatedProfile = mergeProfileUpdates(
      userRawData,
      result.data ?? null,
      submittedProfileUpdates,
    );
    const resolvedName = getProfileDisplayName(updatedProfile) || data.name;

    setProfileSnapshot(updatedProfile);
    prePopulateGeneralForm(updatedProfile);

    updateUser({ name: resolvedName });
    toast.success("Personal information updated successfully");
  };

  const onEducationInfoFormSubmission = async (data: EducationInfoSchema) => {
    const submittedEducationUpdates = {
      classType: data.classType,
      preferredLocations: data.preferredLocations,
      tutorType: data.tutorTypes,
      highestEducation: data.highestEducation,
      yearsExperience: Number(data.yearsExperience),
      tutorMediums: data.tutorMediums,
      grades: data.grades,
      subjects: data.subjects,
      certificatesAndQualifications: data.certificatesAndQualifications,
    };

    const result = await handleProfileSubmit({
      id: userId,
      payload: submittedEducationUpdates,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update qualifications");
      return;
    }

    setProfileSnapshot(
      mergeProfileUpdates(userRawData, result.data ?? null, {
        ...submittedEducationUpdates,
        tutorTypes: data.tutorTypes,
      }),
    );
    educationInfoForm.reset(data);
    toast.success("Qualifications updated successfully");
  };

  const onLanguageAndTimeFormSubmission = async (
    data: LanguageOptionsSchema,
  ) => {
    const submittedLanguageAndTimeUpdates = data;

    const result = await handleProfileSubmit({
      id: userId,
      payload: submittedLanguageAndTimeUpdates,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update languages and availability");
      return;
    }

    setProfileSnapshot(
      mergeProfileUpdates(
        userRawData,
        result.data ?? null,
        submittedLanguageAndTimeUpdates,
      ),
    );
    languageAndTimeForm.reset(data);
    toast.success("Languages and availability updated successfully");
  };

  const onTeachingProfileFormSubmission = async (
    data: TeachingProfileSchema,
  ) => {
    const submittedTeachingUpdates = {
      teachingSummary: data.teachingSummary ?? "",
      academicDetails: data.academicDetails ?? "",
      studentResults: data.studentResults ?? "",
      sellingPoints: data.sellingPoints ?? "",
    };

    const result = await handleProfileSubmit({
      id: userId,
      payload: submittedTeachingUpdates,
    });

    const error = getErrorInApiResult(result);

    if (error) {
      toast.error("Failed to update teaching profile");
      return;
    }

    setProfileSnapshot(
      mergeProfileUpdates(
        userRawData,
        result.data ?? null,
        submittedTeachingUpdates,
      ),
    );
    teachingProfileForm.reset(data);
    toast.success("Teaching profile updated successfully");
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
      profileData: userRawData,
      currentUser: user,
      isAdminProfile,
    },
    forms: {
      generalInfoForm,
      educationInfoForm,
      languageAndTimeForm,
      teachingProfileForm,
    },
    handlers: {
      onGeneralInfoFormSubmission,
      onEducationInfoFormSubmission,
      onLanguageAndTimeFormSubmission,
      onTeachingProfileFormSubmission,
    },
  };
};

export default useLogic;
