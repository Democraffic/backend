import * as multer from 'multer';
import { RequestHandler } from 'express';
import CONFIG from '@/config';

export default function upload(dest: string, name: string): RequestHandler {
    const multerInstance = multer({ dest, limits: { fileSize: CONFIG.UPLOAD.SIZE_LIMIT } });
    return multerInstance.single(name);
}
