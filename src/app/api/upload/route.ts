import { UPLOAD_CONFIG } from "@/configs/upload";
import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const account = UPLOAD_CONFIG.ACCOUNT;
  const container = UPLOAD_CONFIG.CONTAINER;
  const sasToken = UPLOAD_CONFIG.SAS_TOKEN;

  const blobService = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${sasToken}`,
  );

  const containerClient = blobService.getContainerClient(container);

  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return NextResponse.json({ url: blockBlobClient.url });
}
