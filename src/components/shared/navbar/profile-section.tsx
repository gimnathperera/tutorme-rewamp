"use client";

import { useAuthContext } from "@/contexts";
import { useState, useRef, useEffect, FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConfirmationAlert from "../confirm-alert";
import { useRouter } from "next/navigation";
import { AuthUserData } from "@/types/auth-types";
import { useLazyGetProfileQuery } from "@/store/api/splits/users";

type Props = {
  isLoading: boolean;
  user?: AuthUserData;
};

const DEFAULT_AVATAR = "/images/profile/pp.png";

const getFilledString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : "";

const ProfileDropdown: FC<Props> = ({ isLoading, user }) => {
  const { logout, isUserLogoutLoading, updateUser } = useAuthContext();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const [avatarSrc, setAvatarSrc] = useState<string>(DEFAULT_AVATAR);

  const [fetchProfile, { data: profileData }] = useLazyGetProfileQuery();
  const profileName =
    getFilledString(profileData?.name) || getFilledString(profileData?.fullName);
  const profileEmail = getFilledString(profileData?.email);
  const displayName = getFilledString(user?.name);
  const displayEmail = profileEmail || getFilledString(user?.email);
  const userNameRef = useRef(user?.name);
  const userEmailRef = useRef(user?.email);

  useEffect(() => {
    if (user?.id) {
      fetchProfile({ userId: String(user.id) });
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    userNameRef.current = user?.name;
  }, [user?.name]);

  useEffect(() => {
    userEmailRef.current = user?.email;
  }, [user?.email]);

  useEffect(() => {
    const nextUserData: Partial<AuthUserData> = {};

    if (profileName && profileName !== userNameRef.current) {
      nextUserData.name = profileName;
    }

    if (profileEmail && profileEmail !== userEmailRef.current) {
      nextUserData.email = profileEmail;
    }

    if (Object.keys(nextUserData).length > 0) {
      updateUser(nextUserData);
    }
  }, [profileData, profileEmail, profileName, updateUser]);

  useEffect(() => {
    const apiAvatar = (profileData as any)?.avatar;
    const contextAvatar = user?.avatar;

    const finalAvatar =
      (apiAvatar && apiAvatar.trim() !== "") ||
      (contextAvatar && contextAvatar.trim() !== "")
        ? (apiAvatar || contextAvatar)!
        : DEFAULT_AVATAR;

    setAvatarSrc(finalAvatar);
  }, [profileData, user?.avatar]);

  const toggleDropdown = () => {
    const nextIsOpen = !isOpen;

    if (nextIsOpen && user?.id) {
      fetchProfile({ userId: String(user.id) });
    }

    setIsOpen(nextIsOpen);
  };
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutUser = () => {
    closeDropdown();
    logout();
  };

  const handleLogoutConfirmationVisibility = () => {
    setIsLogoutConfirmationOpen((show) => !show);
  };

  const handleOnClickProfile = () => {
    if (!user?.id) return;

    closeDropdown();
    router.push(`/profile/${user?.id}`);
  };

  return (
    <div ref={profileMenuRef} className="relative">
      {isLoading ? (
        <Skeleton
          circle
          height={48}
          width={48}
          baseColor="#f3f3f3"
          highlightColor="#ecebeb"
        />
      ) : (
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
          onClick={toggleDropdown}
        >
          <img
            src={avatarSrc}
            alt="Profile-image"
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>
      )}

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-max min-w-[16rem] max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-gray-900 font-medium truncate">{displayName}</p>
            <p
              className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500"
              title={displayEmail}
            >
              {displayEmail}
            </p>
          </div>
          <ul>
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={handleOnClickProfile}
              >
                Profile
              </button>
            </li>

            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={handleLogoutConfirmationVisibility}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      <ConfirmationAlert
        isOpen={isLogoutConfirmationOpen}
        closeModal={handleLogoutConfirmationVisibility}
        onConfirm={handleLogoutUser}
        title="Logout"
        description="Are you sure you want to logout?"
        cancelText="Cancel"
        confirmText="Logout"
        loading={isUserLogoutLoading}
      />
    </div>
  );
};

export default ProfileDropdown;
