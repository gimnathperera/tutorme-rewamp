"use client";

import { useEffect, useState } from "react";
import FileUploadDropzone from "@/components/fileUploader";
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

  /* ---------------- Fetch avatar ---------------- */
  useEffect(() => {
    if (userId) fetchProfile({ userId: String(userId) });
  }, [userId, fetchProfile]);

  useEffect(() => {
    if ((userData as any)?.avatar) {
      setAvatarUrl((userData as any).avatar);
    }
  }, [userData]);

  /* ---------------- Upload preview ---------------- */
  const handleUploaded = (url: string) => {
    setTempAvatar(url);
  };

  /* ---------------- Save ---------------- */
  const handleSave = async () => {
    if (!tempAvatar || !userId) return;

    try {
      await updateProfile({
        id: String(userId),
        payload: { avatar: tempAvatar } as any,
      }).unwrap();

      setAvatarUrl(tempAvatar); // 🔥 instant UI update
      updateUser({ avatar: tempAvatar });
      setTempAvatar(null);
      setOpen(false);
      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to update avatar");
    }
  };

  /* ---------------- Delete ---------------- */
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

  /* ================================================= */

  return (
    <div className="flex justify-center p-10">
      {/* -------- Avatar + Pen Icon -------- */}
      <div className="relative w-36 h-36">
        <img
          src={avatarUrl}
          alt="User profile picture"
          className="w-full h-full rounded-full object-cover border"
        />

        {/* Edit Icon */}
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <Pencil size={18} />
        </button>

        {/* Delete Icon */}
        <button
          onClick={() => setConfirmDeleteOpen(true)}
          className="absolute bottom-1 left-1 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>

      {/* -------- Modal -------- */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[400px] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Change profile picture
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              JPG, PNG or GIF — Max 800KB
            </p>

            <FileUploadDropzone onUploaded={handleUploaded} />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setTempAvatar(null);
                  setOpen(false);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={!tempAvatar || isLoading}
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-primary-700 text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[360px] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Remove profile picture?
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove your profile picture.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleDelete();
                  setConfirmDeleteOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
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
