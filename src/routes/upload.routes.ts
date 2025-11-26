import { Router } from "express";
import multer from "multer";
import { uploadImage, uploadImages, deleteImage } from "../controllers/upload.controller";
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

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: "object"
 *             properties:
 *               image:
 *                 type: "string"
 *                 format: "binary"
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UploadResponse"
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 */
router.post("/image", authenticate, upload.single("image"), uploadImage);

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     summary: Upload multiple images (max 10)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: "object"
 *             properties:
 *               images:
 *                 type: "array"
 *                 items:
 *                   type: "string"
 *                   format: "binary"
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 success: { type: "boolean", example: true }
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     urls:
 *                       type: "array"
 *                       items: { type: "string", example: "https://pub-xxx.r2.dev/image.jpg" }
 *       400:
 *         description: No files uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 */
router.post("/images", authenticate, upload.array("images", 10), uploadImages);

/**
 * @swagger
 * /api/upload/{filename}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: "string"
 *         description: Filename to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       400:
 *         description: Filename is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/BadRequest"
 */
router.delete("/:filename", authenticate, deleteImage);

export default router;
