import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { UPLOAD_DIR } from '../config';

type DestinationCallBack = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallBack) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
