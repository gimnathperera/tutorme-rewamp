/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { Loader2, X, Eye } from "lucide-react";
import { useEffect, useCallback, useState, MouseEvent } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileItem {
  file?: File;
  url?: string;
  previewUrl?: string;
  name?: string;
  type?: string;
}

interface MultiFileUploadDropzoneProps {
  onUploaded: (urls: string[]) => void;
  initialUrls?: string[];
}

export default function MultiFileUploadDropzone({
  onUploaded,
  initialUrls,
}: MultiFileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  useEffect(() => {
    if (initialUrls) {
      if (files.length === 0 && initialUrls.length > 0) {
        setFiles(
          initialUrls.map((url) => ({
            url,
            name: url.split("/").pop() || "Uploaded File",
            type: url.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          })),
        );
      } else if (files.length > 0 && initialUrls.length === 0 && !uploading) {
        setFiles([]);
      }
    }
  }, [initialUrls, uploading, files.length]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: FileItem[] = acceptedFiles.map((file) => ({
        file,
        name: file.name,
        type: file.type,
      }));
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];
      setFiles((prev) => [...prev, ...newFiles]);

      for (const fileObj of newFiles) {
        if (!fileObj.file) continue;
        const file = fileObj.file;

        if (!allowedTypes.includes(file.type)) {
          alert(`${file.name} is not a supported file type`);
          continue;
        }

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

  const handlePreview = (file: FileItem, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <>
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
                    <p className="truncate max-w-[70%]">{fileObj.name}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handlePreview(fileObj, e)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Preview file"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => removeFile(index, e)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
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

      <Dialog
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-md flex items-center justify-center">
            {previewFile && (
              <>
                {previewFile.type?.startsWith("image/") ||
                (previewFile.file &&
                  previewFile.file.type.startsWith("image/")) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={
                      previewFile.url ||
                      previewFile.previewUrl ||
                      (previewFile.file
                        ? URL.createObjectURL(previewFile.file)
                        : "")
                    }
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : previewFile.type === "application/pdf" ||
                  (previewFile.file &&
                    previewFile.file.type === "application/pdf") ? (
                  <iframe
                    src={
                      previewFile.url ||
                      (previewFile.file
                        ? URL.createObjectURL(previewFile.file)
                        : "")
                    }
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p>Preview not available for this file type.</p>
                    <a
                      href={
                        previewFile.url ||
                        (previewFile.file
                          ? URL.createObjectURL(previewFile.file)
                          : "")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      Download / Open in new tab
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
