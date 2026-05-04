export const UPLOAD_CONFIG = {
  ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
  CONTAINER: process.env.AZURE_CONTAINER_NAME!,
  SAS_TOKEN: process.env.AZURE_SAS_TOKEN!,
  KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY!,
};

export const MULTI_FILE_UPLOAD_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export const MULTI_FILE_UPLOAD_ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export const CERTIFICATE_UPLOAD_ACCEPTED_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  "application/pdf": [".pdf"],
};

export const IMAGE_FILE_UPLOAD_ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

export const IMAGE_UPLOAD_ACCEPTED_TYPES = { "image/*": [] };
