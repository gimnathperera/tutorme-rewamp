import { UPLOAD_CONFIG } from "@/configs/upload";
import {
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const fileName = body.fileName as string;
  const fileType = body.fileType as string;

  if (!fileName) {
    return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
  }

  const account = UPLOAD_CONFIG.ACCOUNT;
  const key = UPLOAD_CONFIG.KEY;
  const container = UPLOAD_CONFIG.CONTAINER;

  const sharedKey = new StorageSharedKeyCredential(account, key);

  const expiresOn = new Date(Date.now() + 15 * 60 * 1000);

  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: fileName,
      permissions: BlobSASPermissions.parse("cw"),
      startsOn: new Date(),
      expiresOn,
      contentType: fileType,
    },
    sharedKey,
  ).toString();

  const uploadUrl = `https://${account}.blob.core.windows.net/${container}/${fileName}?${sas}`;

  return NextResponse.json({ uploadUrl });
}
