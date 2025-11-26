import "dotenv/config";
import { StorageService } from "../src/services/storage.service";
import fs from "fs";

const testMassUpload = async () => {
  try {
    console.log("Initializing StorageService...");
    const storageService = new StorageService();

    // Create dummy files
    const files: Express.Multer.File[] = [
      {
        fieldname: "images",
        originalname: "test1.txt",
        encoding: "7bit",
        mimetype: "text/plain",
        buffer: Buffer.from("File 1 content"),
        size: 14,
        destination: "",
        filename: "",
        path: "",
        stream: fs.createReadStream(__filename),
      },
      {
        fieldname: "images",
        originalname: "test2.txt",
        encoding: "7bit",
        mimetype: "text/plain",
        buffer: Buffer.from("File 2 content"),
        size: 14,
        destination: "",
        filename: "",
        path: "",
        stream: fs.createReadStream(__filename),
      },
    ];

    console.log("Uploading files...");
    const urls = await storageService.uploadFiles(files);
    console.log("Upload successful!");
    console.log("URLs:", urls);

    console.log("Deleting files...");
    for (const url of urls) {
      await storageService.deleteFile(url);
      console.log(`Deleted ${url}`);
    }
    console.log("All files deleted.");

  } catch (error) {
    console.error("Test failed:", error);
  }
};

testMassUpload();
