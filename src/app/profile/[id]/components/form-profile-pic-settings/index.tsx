"use client";

import { useEffect, useState } from "react";
import FileUploadDropzone from "@/components/fileUploader";
import { useAuthContext } from "@/contexts";
import {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/splits/users";
import toast from "react-hot-toast";

const DEFAULT_AVATAR = "/images/profile/pp.png";

const ProfilePicSettings = () => {
  const { user: authUser } = useAuthContext();
  const userId = authUser?.id;

  // ✅ lazy profile fetch
  const [fetchProfile, { data: userData }] = useLazyGetProfileQuery();

  // ✅ update profile mutation
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR); // saved avatar
  const [tempAvatar, setTempAvatar] = useState<string | null>(null); // preview before save

  // ✅ Fetch profile when we have userId
  useEffect(() => {
    if (userId) {
      fetchProfile({ userId: String(userId) });
    }
  }, [userId, fetchProfile]);

  // ✅ Load saved avatar from backend
  useEffect(() => {
    const avatar = (userData as any)?.avatar;
    if (avatar) {
      setAvatarUrl(avatar);
    } else {
      setAvatarUrl(DEFAULT_AVATAR);
    }
  }, [userData]);

  // ✅ Only set preview on upload – don't save yet
  const handleUploaded = (url: string) => {
    setTempAvatar(url);
  };

  // ✅ Save to backend ONLY when clicking Save
  const handleSave = async () => {
    if (!tempAvatar || !userId) return;

    try {
      await updateProfile({
        id: String(userId),
        payload: { avatar: tempAvatar } as any,
      }).unwrap();

      setAvatarUrl(tempAvatar);
      setTempAvatar(null);
      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.error("Avatar save failed:", err);
      toast.error("Failed to save profile picture");
    }
  };

  // ✅ Delete avatar – reset to default
  // ✅ Delete avatar – reset to default (and save default in DB)
  const handleDelete = async () => {
    if (!userId) return;

    try {
      await updateProfile({
        id: String(userId),
        payload: { avatar: DEFAULT_AVATAR } as any, // ⬅ save default image path
      }).unwrap();

      setAvatarUrl(DEFAULT_AVATAR);
      setTempAvatar(null);
      toast.success("Profile picture removed");
    } catch (err) {
      console.error("Avatar delete failed:", err);
      toast.error("Failed to delete profile picture");
    }
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-3xl 2xl:col-span-2  sm:p-6">
      <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <img
          className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-cover"
          src={tempAvatar || avatarUrl}
          alt="profile-image"
        />
        <div>
          <h3 className="mb-1 text-xl font-bold text-gray-900 ">
            Profile picture
          </h3>
          <div className="mb-4 text-sm text-gray-500 ">
            JPG, GIF or PNG. Max size of 800K
          </div>

          {/* 🔹 Upload / drag & drop area */}
          <FileUploadDropzone onUploaded={handleUploaded} />

          <div className="flex items-center space-x-4 mt-4">
            {/* SAVE BUTTON */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!tempAvatar || isLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 disabled:opacity-50"
            >
              Save
            </button>

            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicSettings;
