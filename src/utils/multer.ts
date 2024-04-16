import { Request } from "express";
import multer, { FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  };

  
const upload = multer({ storage: storage });

export default upload;