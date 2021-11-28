import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';
const moveFile = require('move-file');

import { FileSystemError } from '@/errors';
import logger from '@/utils/logger';

import CONFIG from '@/config';

cloudinary.config({
    cloud_name: 'dctcxuevv',
    api_key: CONFIG.CLOUDINARY.API_KEY,
    api_secret: CONFIG.CLOUDINARY.API_SECRET,
});

export class FileSystemService {
    private async save(basepath: string, data: string, fileName: string, subpath = ''): Promise<string> {
        const dirPath = path.join(basepath, subpath);
        const filePath = path.resolve(dirPath, fileName);

        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
            await fs.promises.writeFile(filePath, data);
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }

        return filePath;
    }

    private async saveRandomName(
        basepath: string,
        data: string | Buffer,
        extension: string,
        subpath = ''
    ): Promise<string> {
        const file = `${uuid()}.${extension}`;
        const dirPath = path.join(basepath, subpath);
        const filePath = path.resolve(dirPath, file);

        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
            await fs.promises.writeFile(filePath, data);
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }

        return filePath;
    }

    public getStoredPath(subpath: string): string {
        return path.join(CONFIG.STORED.PATH, subpath);
    }

    public async saveTempRandomName(data: string | Buffer, extension: string, subpath = ''): Promise<string> {
        return this.saveRandomName(CONFIG.TEMP.PATH, data, extension, subpath);
    }

    public async saveStoredRandomName(data: string, extension: string, subpath = ''): Promise<string> {
        return this.saveRandomName(CONFIG.STORED.PATH, data, extension, subpath);
    }

    public async saveTemp(data: string, fileName: string, subpath = ''): Promise<string> {
        return this.save(CONFIG.TEMP.PATH, data, fileName, subpath);
    }

    public async saveStored(data: string, fileName: string, subpath = ''): Promise<string> {
        return this.save(CONFIG.STORED.PATH, data, fileName, subpath);
    }

    public async moveToStored(tempPath: string, fileName: string, subpath = ''): Promise<string> {
        try {
            const toDir = path.join(CONFIG.STORED.PATH, subpath);
            const toPath = path.join(toDir, fileName);
            await fs.promises.mkdir(toDir, { recursive: true });
            await moveFile(tempPath, toPath);
            return toPath;
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }
    }

    public async uploadToStored(tempPath: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(tempPath);
            return result.url;
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }
    }

    public async removeStored(fileName: string, subpath = ''): Promise<string> {
        try {
            const fileDir = path.join(CONFIG.STORED.PATH, subpath);
            const filePath = path.join(fileDir, fileName);
            await fs.promises.unlink(filePath);
            return filePath;
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }
    }

    public async removeStoredByPath(subpath: string): Promise<string> {
        try {
            const filePath = path.join(CONFIG.STORED.PATH, subpath);
            await fs.promises.unlink(filePath);
            return filePath;
        } catch (error) {
            logger.warning('File system error', error);
            throw new FileSystemError();
        }
    }
}

export default new FileSystemService();
