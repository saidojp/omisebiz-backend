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

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const urls = await storageService.uploadFiles(req.files as Express.Multer.File[]);

    res.status(200).json({
      success: true,
      data: {
        urls,
      },
    });
  } catch (error) {
    console.error("Mass upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload images",
    });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    if (!filename) {
      res.status(400).json({ error: "Filename is required" });
      return;
    }

    // Construct full URL or just pass filename depending on StorageService implementation
    // StorageService expects full URL to extract filename, but we can also just pass the filename if we modify it.
    // However, looking at StorageService.deleteFile, it splits by '/' and takes the last part.
    // So passing just the filename works if we prepend a dummy URL or if we modify StorageService.
    // Let's check StorageService.deleteFile again.
    // It does: const fileName = fileUrl.split("/").pop();
    // So if we pass "filename.jpg", it returns "filename.jpg". Correct.
    
    await storageService.deleteFile(filename);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};
