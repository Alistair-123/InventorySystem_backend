import fs from "fs";
import path from "path";

export const deleteFileIfExists = (filePath) => {
  if (!filePath) return;

  const absolutePath = path.resolve(filePath.startsWith("src")
    ? filePath
    : `src${filePath}`);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};
