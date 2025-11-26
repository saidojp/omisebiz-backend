import "dotenv/config";
import { StorageService } from "../src/services/storage.service";
import fs from "fs";
import path from "path";

const testUpload = async () => {
  try {
    console.log("Initializing StorageService...");
    console.log("R2_BUCKET_NAME:", process.env.R2_BUCKET_NAME ? "Present" : "Missing", "Length:", process.env.R2_BUCKET_NAME?.length);
    console.log("R2_PUBLIC_URL:", process.env.R2_PUBLIC_URL ? "Present" : "Missing", "Length:", process.env.R2_PUBLIC_URL?.length);
    
    const storageService = new StorageService();

    // Create a dummy file object
    const dummyFile: Express.Multer.File = {
      fieldname: "image",
      originalname: "test-upload.txt",
      encoding: "7bit",
      mimetype: "text/plain",
      buffer: Buffer.from("This is a test upload to R2 from the verification script."),
      size: 48,
      destination: "",
      filename: "",
      path: "",
      stream: fs.createReadStream(__filename), // Dummy stream
    };

    console.log("Uploading file...");
    const url = await storageService.uploadFile(dummyFile);
    console.log("Upload successful!");
    console.log("File URL:", url);

    // Optional: Delete the file
    // console.log("Deleting file...");
    // await storageService.deleteFile(url);
    // console.log("Delete successful!");

  } catch (error) {
    console.error("Test failed:", error);
  }
};

testUpload();
