import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../config/r2";
import path from "path";
import crypto from "crypto";

export class StorageService {
  private bucketName = process.env.R2_BUCKET_NAME;
  private publicUrl = process.env.R2_PUBLIC_URL;

  constructor() {
    if (!this.bucketName) console.warn("R2_BUCKET_NAME is missing");
    if (!this.publicUrl) console.warn("R2_PUBLIC_URL is missing");
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.bucketName || !this.publicUrl) {
      throw new Error("Storage configuration missing");
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(command);

    return `${this.publicUrl}/${fileName}`;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!this.bucketName) {
      throw new Error("Storage configuration missing");
    }

    const fileName = fileUrl.split("/").pop();
    if (!fileName) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await r2Client.send(command);
  }
}
