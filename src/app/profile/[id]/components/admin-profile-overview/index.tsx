"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/configs/env";
import { AuthUserData } from "@/types/auth-types";
import { ProfileResponse } from "@/types/response-types";
import {
  ExternalLink,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { FC, useMemo, useState } from "react";

type Props = {
  profile: ProfileResponse | null;
  currentUser: AuthUserData | null;
  isLoading: boolean;
};

type DetailItem = {
  label: string;
  value: string;
};

const DEFAULT_AVATAR = "/images/profile/pp.png";
const EMPTY_VALUE = "Not provided";

const formatText = (value?: string | null) => {
  if (!value?.trim()) return EMPTY_VALUE;

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value?: string | null) => {
  if (!value?.trim()) return EMPTY_VALUE;

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getProfileName = (
  profile: ProfileResponse | null,
  currentUser: AuthUserData | null,
) => profile?.fullName || profile?.name || currentUser?.name || "Admin user";

const getProfileEmail = (
  profile: ProfileResponse | null,
  currentUser: AuthUserData | null,
) => profile?.email || currentUser?.email || EMPTY_VALUE;

const getContactNumber = (profile: ProfileResponse | null) =>
  profile?.phoneNumber || profile?.contactNumber || EMPTY_VALUE;

const getLocation = (profile: ProfileResponse | null) =>
  [profile?.city, profile?.state, profile?.country]
    .filter(Boolean)
    .join(", ") || EMPTY_VALUE;

const getEmailVerification = (profile: ProfileResponse | null) => {
  if (typeof profile?.isEmailVerified !== "boolean") return EMPTY_VALUE;

  return profile.isEmailVerified ? "Verified" : "Not verified";
};

const AdminProfileOverview: FC<Props> = ({
  profile,
  currentUser,
  isLoading,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const displayName = getProfileName(profile, currentUser);
  const displayEmail = getProfileEmail(profile, currentUser);
  const avatarUrl = profile?.avatar || currentUser?.avatar || DEFAULT_AVATAR;

  const accountDetails = useMemo<DetailItem[]>(
    () => [
      {
        label: "Role",
        value: formatText(profile?.role || currentUser?.role),
      },
      {
        label: "Status",
        value: formatText(profile?.status || currentUser?.status),
      },
      {
        label: "Email Verification",
        value: getEmailVerification(profile),
      },
      {
        label: "Member Since",
        value: formatDate(profile?.createdAt),
      },
    ],
    [currentUser?.role, currentUser?.status, profile],
  );

  const personalDetails = useMemo<DetailItem[]>(
    () => [
      {
        label: "Full Name",
        value: displayName,
      },
      {
        label: "Email",
        value: displayEmail,
      },
      {
        label: "Contact Number",
        value: getContactNumber(profile),
      },
      {
        label: "Date of Birth",
        value: formatDate(profile?.birthday || profile?.dateOfBirth),
      },
      {
        label: "Gender",
        value: formatText(profile?.gender),
      },
      {
        label: "Location",
        value: getLocation(profile),
      },
    ],
    [displayEmail, displayName, profile],
  );

  if (isLoading && !profile) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-11 w-full sm:w-36" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border-b border-gray-100 pb-4">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="Admin profile picture"
              className="h-20 w-20 rounded-full border border-gray-100 object-cover shadow-sm sm:h-24 sm:w-24"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </span>
              <h2 className="mt-3 text-xl font-semibold text-gray-900 sm:text-2xl">
                {displayName}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                {displayEmail}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsEditDialogOpen(true)}
            className="h-11 w-full rounded-lg bg-primary-700 px-5 text-sm font-semibold text-white hover:bg-primary-800 sm:w-auto"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
            <UserRound className="h-5 w-5 text-primary-700" />
            Personal Details
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {personalDetails.map((item) => (
              <div key={item.label} className="border-b border-gray-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            Account Details
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {accountDetails.map((item) => (
              <div key={item.label} className="border-b border-gray-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 sm:rounded-3xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Admin Profile
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-600">
              You are an admin, to edit your profile please login your admin
              portal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-center sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg px-5 font-semibold"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() =>
                window.open(
                  env.urls.adminPortalUrl,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="h-11 rounded-lg bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800"
            >
              <ExternalLink className="h-4 w-4" />
              Admin Portal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProfileOverview;
