/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { IMAGE_UPLOAD_ACCEPTED_TYPES } from "@/configs/upload";

interface FileUploadDropzoneProps {
  onUploaded: (url: string) => void;
}

const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;

  const compressedFile = await imageCompression(file, {
    maxWidthOrHeight: 1200,
    initialQuality: 0.9, // visually lossless
    useWebWorker: true,
  });

  return new File([compressedFile], file.name, {
    type: compressedFile.type,
    lastModified: Date.now(),
  });
};

export default function FileUploadDropzone({
  onUploaded,
}: FileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Max 5MB allowed");
        return;
      }

      setUploading(true);

      try {
        // compress BEFORE upload
        const optimizedFile = await compressImage(file);

        setFileName(optimizedFile.name);

        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(optimizedFile);

        console.log("Original:", (file.size / 1024).toFixed(2), "KB");
        console.log("Optimized:", (optimizedFile.size / 1024).toFixed(2), "KB");
        const signed = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: `${Date.now()}-${optimizedFile.name}`,
            fileType: optimizedFile.type,
          }),
        }).then((res) => res.json());

        const uploadUrl = signed.uploadUrl;

        if (!uploadUrl) {
          alert("Failed to generate upload URL");
          return;
        }
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": optimizedFile.type,
          },
          body: optimizedFile,
        });

        if (!uploadRes.ok) {
          alert("Upload failed");
          return;
        }

        const publicUrl = uploadUrl.split("?")[0];
        onUploaded(publicUrl);
      } catch (error) {
        console.error("Image optimization/upload failed:", error);
        alert("Image upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setFileName("");
    setPreviewUrl(null);
    onUploaded("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: IMAGE_UPLOAD_ACCEPTED_TYPES,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          <p className="text-gray-500 text-sm">Optimizing and uploading...</p>
        </div>
      ) : isDragActive ? (
        <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
          Drop the file here...
        </p>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            Drag & drop or tap to upload
          </p>

          {fileName && (
            <div className="mt-2 flex items-center justify-center gap-2 w-full px-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 w-auto max-w-full min-w-[120px] truncate break-all">
                {fileName}
              </p>

              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {previewUrl && (
            <div className="mt-3 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
