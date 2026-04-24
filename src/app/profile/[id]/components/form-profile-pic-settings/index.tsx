"use client";

import { useEffect, useState } from "react";
import FileUploadDropzone from "@/components/upload/file-upload-dropzone";
import { useAuthContext } from "@/contexts";
import {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/splits/users";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const DEFAULT_AVATAR = "/images/profile/pp.png";

const ProfilePicSettings = () => {
  const { user, updateUser } = useAuthContext();
  const userId = user?.id;

  const [fetchProfile, { data: userData }] = useLazyGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile({ userId: String(userId) });
  }, [userId, fetchProfile]);

  useEffect(() => {
    if ((userData as any)?.avatar) {
      setAvatarUrl((userData as any).avatar);
    }
  }, [userData]);

  const handleUploaded = (url: string) => {
    setTempAvatar(url);
  };

  const handleSave = async () => {
    if (!tempAvatar || !userId) return;

    try {
      await updateProfile({
        id: String(userId),
        payload: { avatar: tempAvatar } as any,
      }).unwrap();

      setAvatarUrl(tempAvatar);
      updateUser({ avatar: tempAvatar });
      setTempAvatar(null);
      setOpen(false);
      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to update avatar");
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await updateProfile({
        id: String(userId),
        payload: { avatar: DEFAULT_AVATAR } as any,
      }).unwrap();

      setAvatarUrl(DEFAULT_AVATAR);
      updateUser({ avatar: DEFAULT_AVATAR });
      setTempAvatar(null);
      setOpen(false);
      toast.success("Profile picture removed");
    } catch {
      toast.error("Failed to delete avatar");
    }
  };

  return (
    <div className="rounded-2xl bg-white px-4 py-6 shadow-sm sm:rounded-3xl sm:px-6 sm:py-8">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Profile Photo
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Choose a clear, professional photo for your public tutor profile.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative h-28 w-28 sm:h-36 sm:w-36">
          <img
            src={avatarUrl}
            alt="User profile picture"
            className="h-full w-full rounded-full border object-cover"
          />

          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow transition-colors hover:bg-gray-100 sm:p-2.5"
            aria-label="Edit profile picture"
          >
            <Pencil size={16} className="sm:h-[18px] sm:w-[18px]" />
          </button>

          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="absolute bottom-1 left-1 rounded-full bg-white p-2 shadow transition-colors hover:bg-gray-100 sm:p-2.5"
            aria-label="Delete profile picture"
          >
            <Trash2
              size={16}
              className="text-red-600 sm:h-[18px] sm:w-[18px]"
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 sm:p-6">
            <h3 className="mb-2 text-lg font-semibold sm:text-xl">
              Change profile photo
            </h3>

            <p className="mb-4 text-sm text-gray-500">
              JPG, PNG or GIF - Max 800KB
            </p>

            <FileUploadDropzone onUploaded={handleUploaded} />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setTempAvatar(null);
                  setOpen(false);
                }}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold sm:text-base"
              >
                Cancel
              </button>

              <button
                disabled={!tempAvatar || isLoading}
                onClick={handleSave}
                className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-4 sm:p-6">
            <h3 className="mb-2 text-lg font-semibold sm:text-xl">
              Remove profile picture?
            </h3>

            <p className="mb-6 text-sm text-gray-500">
              This will permanently remove your current profile photo.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold sm:text-base"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleDelete();
                  setConfirmDeleteOpen(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicSettings;
