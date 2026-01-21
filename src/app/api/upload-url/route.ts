import { UPLOAD_CONFIG } from "@/configs/upload";
import {
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fileName } = await req.json();
  if (!fileName) {
    return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
  }

  const account = UPLOAD_CONFIG.ACCOUNT;
  const key = UPLOAD_CONFIG.KEY;
  const container = UPLOAD_CONFIG.CONTAINER;

  const sharedKey = new StorageSharedKeyCredential(account, key);

  const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: fileName,
      permissions: BlobSASPermissions.parse("cw"), // create + write
      expiresOn,
    },
    sharedKey,
  ).toString();

  const uploadUrl = `https://${account}.blob.core.windows.net/${container}/${fileName}?${sas}`;

  return NextResponse.json({ uploadUrl });
}
