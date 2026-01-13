"use client";

import { Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadDropzoneProps {
  onUploaded: (url: string) => void;
}

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

      setUploading(true);
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      const signed = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `${Date.now()}-${file.name}`,
          fileType: file.type,
        }),
      }).then((res) => res.json());

      const uploadUrl = signed.uploadUrl;
      if (!uploadUrl) {
        setUploading(false);
        alert("Failed to generate SAS URL");
        return;
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      setUploading(false);

      if (!uploadRes.ok) {
        alert("Upload failed");
        return;
      }

      const publicUrl = uploadUrl.split("?")[0];

      onUploaded(publicUrl);
    },
    [onUploaded],
  );

  const removeFile = () => {
    setFileName("");
    setPreviewUrl(null);
    onUploaded("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
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
          <p className="text-gray-500 text-sm">Uploading...</p>
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
              <p
                className="
      text-sm text-gray-500 dark:text-gray-400
      w-auto
      max-w-full
      min-w-[120px]
      truncate
      break-all
    "
              >
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
