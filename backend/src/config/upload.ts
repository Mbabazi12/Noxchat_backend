import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageEngine } from 'multer';

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });
export default upload;
