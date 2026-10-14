import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

uploadRouter.post(
  "/",
  auth,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Rasm hajmi 5 MB dan oshmasligi kerak",
          });
        }

        return res.status(400).json({
          message: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          message: err.message || "Rasmni tekshirishda xatolik",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Rasm tanlanmagan",
        });
      }

      const b64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "grocery-del",
        resource_type: "image",
      });

      return res.status(200).json({
        url: result.secure_url,
      });
    } catch (error: any) {
      console.error(
        "UPLOAD ERROR:",
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      );

      return res.status(500).json({
        message: error?.message || "Upload failed",
        http_code: error?.http_code || null,
        name: error?.name || null,
        details: error?.error || null,
      });
    }
  },
);

export default uploadRouter;
