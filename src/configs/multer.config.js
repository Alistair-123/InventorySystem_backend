import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_PATHS = {
  personnelImage: "src/uploads/personnels",
  itemImage: "src/uploads/items",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = UPLOAD_PATHS[file.fieldname];

    if (!uploadPath) {
      return cb(new Error("Invalid upload field"));
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
