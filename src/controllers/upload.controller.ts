import { Request, Response } from "express";
import { StorageService } from "../services/storage.service";

const storageService = new StorageService();

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const url = await storageService.uploadFile(req.file);

    res.status(200).json({
      success: true,
      data: {
        url,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload image",
    });
  }
};
