"use client";

import { Loader2, X } from "lucide-react";
import { useCallback, useState, MouseEvent } from "react";
import { useDropzone } from "react-dropzone";

interface FileItem {
  file: File;
  url?: string;
  previewUrl?: string;
}

interface MultiFileUploadDropzoneProps {
  onUploaded: (urls: string[]) => void;
}

export default function MultiFileUploadDropzone({
  onUploaded,
}: MultiFileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: FileItem[] = acceptedFiles.map((file) => ({ file }));
      setFiles((prev) => [...prev, ...newFiles]);

      for (const fileObj of newFiles) {
        const file = fileObj.file;
        setUploading(true);

        // Preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            fileObj.previewUrl = reader.result as string;
            setFiles((prev) => [...prev]); // refresh state
          };
          reader.readAsDataURL(file);
        }

        try {
          // Get signed upload URL
          const signed = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: `${Date.now()}-${file.name}`,
              fileType: file.type,
            }),
          }).then((res) => res.json());

          const uploadUrl = signed.uploadUrl;
          if (!uploadUrl) throw new Error("Failed to generate upload URL");

          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "x-ms-blob-type": "BlockBlob",
              "Content-Type": file.type,
            },
            body: file,
          });

          if (!uploadRes.ok) throw new Error("Upload failed");

          // Save uploaded URL
          fileObj.url = uploadUrl.split("?")[0];
          setFiles((prev) => [...prev]); // refresh state
          // Update form with all uploaded URLs
          onUploaded(
            [...files.filter((f) => f.url), fileObj]
              .filter((f) => f.url)
              .map((f) => f.url!),
          );
        } catch (err) {
          console.error(err);
          alert(`Upload failed for ${file.name}`);
        } finally {
          setUploading(false);
        }
      }
    },
    [files, onUploaded],
  );

  const removeFile = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onUploaded(updatedFiles.filter((f) => f.url).map((f) => f.url!));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 bg-white border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
    >
      <input {...getInputProps()} />
      {uploading && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          <p className="text-gray-500 text-sm">Uploading...</p>
        </div>
      )}
      {!uploading && isDragActive && (
        <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
          Drop the files here...
        </p>
      )}
      {!uploading && !isDragActive && (
        <>
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            Drag & drop or click to upload certificates
          </p>
          {files.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded bg-gray-50 dark:bg-gray-700"
                >
                  <p className="truncate max-w-[80%]">{fileObj.file.name}</p>
                  <div className="flex items-center gap-2">
                    {fileObj.previewUrl && (
                      <img
                        src={fileObj.previewUrl}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => removeFile(index, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
