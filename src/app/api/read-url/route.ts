import { UPLOAD_CONFIG } from "@/configs/upload";
import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextResponse } from "next/server";

/**
 * Returns a short-lived read (`r`) SAS URL for a previously uploaded blob, so
 * previews work even when the container has no anonymous read access (the case
 * in production). Accepts either the stored blob `url` or a raw `fileName`.
 */
export async function POST(req: Request) {
  const body = await req.json();

  const account = UPLOAD_CONFIG.ACCOUNT;
  const key = UPLOAD_CONFIG.KEY;
  const container = UPLOAD_CONFIG.CONTAINER;

  let blobName: string | null =
    typeof body.fileName === "string" ? body.fileName : null;

  if (!blobName && typeof body.url === "string") {
    const marker = `/${container}/`;
    const index = body.url.indexOf(marker);
    if (index >= 0) {
      blobName = decodeURIComponent(
        body.url.slice(index + marker.length).split("?")[0],
      );
    }
  }

  if (!blobName) {
    return NextResponse.json(
      { error: "Missing fileName or url" },
      { status: 400 },
    );
  }

  const sharedKey = new StorageSharedKeyCredential(account, key);
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName,
      permissions: BlobSASPermissions.parse("r"), // read only
      expiresOn,
    },
    sharedKey,
  ).toString();

  const url = `https://${account}.blob.core.windows.net/${container}/${encodeURIComponent(
    blobName,
  )}?${sas}`;

  // Resolve the blob's real content type so the client can detect image/PDF
  // reliably even when the stored URL has no (or an unusual) extension.
  let contentType: string | undefined;
  try {
    const serviceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      sharedKey,
    );
    const properties = await serviceClient
      .getContainerClient(container)
      .getBlobClient(blobName)
      .getProperties();
    contentType = properties.contentType;
  } catch {
    // Non-fatal — the client falls back to extension-based detection.
  }

  return NextResponse.json({ url, contentType });
}
