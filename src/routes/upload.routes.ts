import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post("/image", authenticate, upload.single("image"), uploadImage);

export default router;
