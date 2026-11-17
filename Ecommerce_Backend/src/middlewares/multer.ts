import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "node:fs";
import path from "node:path";
import ErrorHandler from "../utils/utility-class.js";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename(req, file, callback) {
    const id = uuid();
    const parsedExt = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(parsedExt)
      ? parsedExt
      : ".jpg";
    const fileName = `${id}${safeExt}`;
    callback(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ErrorHandler(
        "Invalid file format. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.",
        400
      )
    );
  }
};

export const singleUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
}).single("photo");