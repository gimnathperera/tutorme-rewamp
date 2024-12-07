"use client";

import { useAuthContext } from "@/contexts";
import { useLazyGetProfileQuery } from "@/store/api/splits/users";
import { ProfileResponse } from "@/types/response-types";
import { getErrorInApiResult } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type LogicReturnType = {
  derivedData: {};
};

const useLogic = (): LogicReturnType => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user, isUserLoaded } = useAuthContext();
  const [userRawData, setUserRawData] = useState<ProfileResponse | null>(null);

  const [fetchProfileData, { isLoading: isProfileDataLoading }] =
    useLazyGetProfileQuery();

  // TODO: may be find a better way to handle this
  const forceRedirectUser = useCallback(() => {
    if (isUserLoaded && !user) {
      router.push("/");
      return;
    }
  }, [isUserLoaded, router, user]);

  const getUserRawData = useCallback(async () => {
    const result = await fetchProfileData({ userId });
    const error = getErrorInApiResult(result);
    if (error) {
      toast.error("Failed to load profile data. Please try again later.");
      return;
    }

    console.log(result.data);
  }, [fetchProfileData, userId]);

  const init = useCallback(async () => {
    await getUserRawData();
  }, [getUserRawData]);

  useEffect(() => {
    forceRedirectUser();
    if (!userId || !user) return;
    init();
  }, [forceRedirectUser, init, user, userId]);

  return {
    derivedData: {},
  };
};

export default useLogic;
