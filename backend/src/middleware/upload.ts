import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3";

export const videoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const key = `videos/${Date.now()}-${file.originalname}`;
      cb(null, key);
    },
  }),
});

export const fileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    key: (req, file, cb) => {
      const key = `attachments/${Date.now()}-${file.originalname}`;
      cb(null, key);
    },
  }),
});