/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { Eye, Loader2, Minus, Plus, X } from "lucide-react";
import {
  useCallback,
  useState,
  MouseEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { CERTIFICATE_UPLOAD_ACCEPTED_TYPES } from "@/configs/upload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FileItem {
  /** Null for entries that were pre-seeded from existing URLs (no File in memory). */
  file: File | null;
  url?: string;
  /** Local data-URL used for image preview before/after upload. */
  previewUrl?: string;
  /** Object URL created for PDF preview (needs revoke on unmount). */
  blobUrl?: string;
}

interface MultiFileUploadDropzoneProps {
  onUploaded: (urls: string[]) => void;
  /** Pre-existing URLs to hydrate the list with (e.g. after tab navigation). */
  initialUrls?: string[];
  labels?: Partial<UploadDropzoneLabels>;
}

type UploadDropzoneLabels = {
  certificateFallback: string;
  zoomOut: string;
  zoomIn: string;
  closePreview: string;
  previewUnavailable: string;
  fileTypeRejection: string;
  uploadFailedFor: (fileName: string) => string;
  uploading: string;
  dropFilesHere: string;
  uploadCertificatesCta: string;
  acceptedFileTypes: string;
  previewFile: string;
  removeFile: string;
};

const defaultLabels: UploadDropzoneLabels = {
  certificateFallback: "Certificate",
  zoomOut: "Zoom out",
  zoomIn: "Zoom in",
  closePreview: "Close preview",
  previewUnavailable: "Preview not available for this file type.",
  fileTypeRejection:
    "Only image files (JPG, PNG) and PDF documents are allowed.",
  uploadFailedFor: (fileName) => `Upload failed for ${fileName}`,
  uploading: "Uploading...",
  dropFilesHere: "Drop the files here...",
  uploadCertificatesCta: "Drag & drop or click to upload certificates",
  acceptedFileTypes: "Accepted: JPG, PNG, PDF",
  previewFile: "Preview file",
  removeFile: "Remove file",
};

// ---------------------------------------------------------------------------
// Preview Modal
// ---------------------------------------------------------------------------

interface PreviewModalProps {
  fileItem: FileItem;
  onClose: () => void;
  labels: UploadDropzoneLabels;
}

function PreviewModal({ fileItem, onClose, labels }: PreviewModalProps) {
  const [scale, setScale] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Determine what to preview
  const isImage = fileItem.file
    ? fileItem.file.type.startsWith("image/")
    : !!fileItem.previewUrl ||
      /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(fileItem.url ?? "");

  const isPdf = fileItem.file
    ? fileItem.file.type === "application/pdf"
    : fileItem.url?.toLowerCase().endsWith(".pdf");

  // The src to use
  const imageSrc = fileItem.previewUrl ?? fileItem.url;
  const pdfSrc = fileItem.blobUrl ?? fileItem.url;

  // Close on overlay click
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const fileName = fileItem.file
    ? fileItem.file.name
    : (fileItem.url?.split("/").pop() ?? labels.certificateFallback);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="relative flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-[90vw] max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 shrink-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[80%]">
            {fileName}
          </p>
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <button
              type="button"
              onClick={() =>
                setScale((s) => Math.max(0.25, +(s - 0.25).toFixed(2)))
              }
              className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={labels.zoomOut}
            >
              <Minus size={14} />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() =>
                setScale((s) => Math.min(4, +(s + 0.25).toFixed(2)))
              }
              className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={labels.zoomIn}
            >
              <Plus size={14} />
            </button>
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-7 w-7 rounded-md text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-500 transition"
              title={labels.closePreview}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-gray-50 dark:bg-gray-800">
          {isImage && imageSrc && (
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }}
              className="transition-transform duration-150"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={fileName}
                className="max-w-full rounded shadow"
              />
            </div>
          )}

          {isPdf && pdfSrc && (
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                width: "100%",
                height: "70vh",
              }}
              className="transition-transform duration-150"
            >
              <embed
                src={pdfSrc}
                type="application/pdf"
                className="w-full h-full rounded shadow"
              />
            </div>
          )}

          {!isImage && !isPdf && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
              <p className="text-sm">{labels.previewUnavailable}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Allowed types
// ---------------------------------------------------------------------------

const buildItemsFromUrls = (urls: string[]): FileItem[] =>
  urls.map((url) => ({ file: null, url }));

const getUploadedUrls = (items: FileItem[]): string[] =>
  items.filter((item) => item.url).map((item) => item.url!);

const areUrlsEqual = (items: FileItem[], urls: string[]): boolean => {
  const currentUrls = getUploadedUrls(items);
  return (
    currentUrls.length === urls.length &&
    currentUrls.every((url, index) => url === urls[index])
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MultiFileUploadDropzone({
  onUploaded,
  initialUrls,
  labels: labelOverrides,
}: MultiFileUploadDropzoneProps) {
  const labels = useMemo(
    () => ({ ...defaultLabels, ...labelOverrides }),
    [labelOverrides],
  );
  const [uploading, setUploading] = useState(false);
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  // Lazy initializer: seed from pre-existing URLs so the list is populated
  // immediately on mount without an extra render / useEffect flash.
  const [files, setFiles] = useState<FileItem[]>(() =>
    buildItemsFromUrls(initialUrls ?? []),
  );
  const filesRef = useRef<FileItem[]>(files);

  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    const urls = initialUrls ?? [];

    setFiles((prev) => {
      if (areUrlsEqual(prev, urls)) return prev;

      const pendingFiles = prev.filter((fileItem) => !fileItem.url);
      const hydratedFiles = urls.map(
        (url) =>
          prev.find((fileItem) => fileItem.url === url) ?? { file: null, url },
      );

      const nextFiles = [...hydratedFiles, ...pendingFiles];
      filesRef.current = nextFiles;
      return nextFiles;
    });
  }, [initialUrls]);

  // Revoke any blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
      });
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejected: FileRejection[]) => {
      // Show rejection errors
      if (rejected.length > 0) {
        setRejectionError(labels.fileTypeRejection);
      } else {
        setRejectionError(null);
      }

      if (acceptedFiles.length === 0) return;

      const newFiles: FileItem[] = acceptedFiles.map((file) => {
        // Create a blob URL for PDFs so we can preview before upload completes
        const blobUrl =
          file.type === "application/pdf"
            ? URL.createObjectURL(file)
            : undefined;
        return { file, blobUrl };
      });

      setFiles((prev) => [...prev, ...newFiles]);

      for (const fileObj of newFiles) {
        const file = fileObj.file;
        if (!file) continue;
        setUploading(true);

        // Local preview for images
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
          const uploadedUrl = uploadUrl.split("?")[0];
          fileObj.url = uploadedUrl;
          setFiles((prev) => {
            const nextFiles = prev.map((item) =>
              item === fileObj ? { ...item, url: uploadedUrl } : item,
            );
            filesRef.current = nextFiles;
            onUploaded(getUploadedUrls(nextFiles));
            return nextFiles;
          });
        } catch (err) {
          console.error(err);
          alert(labels.uploadFailedFor(file.name));
        } finally {
          setUploading(false);
        }
      }
    },
    [labels, onUploaded],
  );

  const removeFile = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const target = files[index];
    // Revoke blob URL if any
    if (target?.blobUrl) URL.revokeObjectURL(target.blobUrl);
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    filesRef.current = updatedFiles;
    onUploaded(getUploadedUrls(updatedFiles));
  };

  const openPreview = (
    fileItem: FileItem,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setPreviewItem(fileItem);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: CERTIFICATE_UPLOAD_ACCEPTED_TYPES,
  });

  return (
    <>
      {/* Preview Modal */}
      {previewItem && (
        <PreviewModal
          fileItem={previewItem}
          onClose={() => setPreviewItem(null)}
          labels={labels}
        />
      )}

      <div
        {...getRootProps()}
        className="w-full min-w-0 overflow-hidden border-2 bg-white border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
      >
        <input {...getInputProps()} />
        {uploading && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            <p className="text-gray-500 text-sm">{labels.uploading}</p>
          </div>
        )}
        {!uploading && isDragActive && (
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            {labels.dropFilesHere}
          </p>
        )}
        {!uploading && !isDragActive && (
          <>
            <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
              {labels.uploadCertificatesCta}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {labels.acceptedFileTypes}
            </p>

            {files.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 max-h-60 overflow-y-auto overflow-x-hidden">
                {files.map((fileObj, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 min-w-0 overflow-hidden border p-2 rounded bg-gray-50 dark:bg-gray-700"
                  >
                    <p
                      className="truncate flex-1 min-w-0 text-left text-sm"
                      title={
                        fileObj.file
                          ? fileObj.file.name
                          : (fileObj.url?.split("/").pop() ??
                            labels.certificateFallback)
                      }
                    >
                      {fileObj.file
                        ? fileObj.file.name
                        : (fileObj.url?.split("/").pop() ??
                          labels.certificateFallback)}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Eye / preview button */}
                      <button
                        type="button"
                        onClick={(e) => openPreview(fileObj, e)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title={labels.previewFile}
                      >
                        <Eye size={16} />
                      </button>
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => removeFile(index, e)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title={labels.removeFile}
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

      {/* Rejection / validation error */}
      {rejectionError && (
        <p className="text-sm text-red-500 mt-1">{rejectionError}</p>
      )}
    </>
  );
}
