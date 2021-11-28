import { Request, Router } from 'express';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

import { dbQuery, dbTransaction } from '@/services/db.service';
import fileSystemService from '@/services/filesystem.service';

import asyncHandler from '@/utils/asyncHandler';
import upload from '@/utils/uploader';
import { validateDbId } from '@/utils/validatorMiddlewares';

import { ReqIdParams, Report } from '@/types';
import { InternalServerError, InvalidQueryParamError, NotFoundError } from '@/errors';

import CONFIG from '@/config';
import filesystemService from '@/services/filesystem.service';

type TypedReq = Request & ReqIdParams & { report: Report };

export default function (): Router {
    const router = Router({ mergeParams: true });

    router.use(validateDbId('id'));
    router.use(asyncHandler(async (req, res, next) => {
        const typedReq = req as TypedReq;
        const id = typedReq.idParams.id;

        const report = await dbQuery<Report | null>(db => {
            return db.collection<Report>('reports').findOne({
                _id: id
            });
        });

        if (report === null) {
            throw new NotFoundError('Report not found');
        }

        typedReq.report = report;
        next();
    }));

    router.get('/', asyncHandler(async (req, res) => {
        const typedReq = req as TypedReq;
        res.json(typedReq.report.media);
    }));

    router.post('/', upload(CONFIG.TEMP.PATH, 'media'), asyncHandler(async (req, res) => {
        const typedReq = req as TypedReq;

        const tempFile = req.file;
        if (!tempFile) {
            throw new InvalidQueryParamError('No file uploaded');
        }
        const tempPath = tempFile.path;

        const resultPath = await dbTransaction<string>(async (db, session) => {
            const resultPath = await fileSystemService.uploadToStored(tempPath); // For now hosted on cloud, see commit history to restore good
            await db.collection<Report>('reports').updateOne({ _id: typedReq.report._id }, {
                $push: {
                    media: resultPath
                }
            }, { session });
            return resultPath;
        });

        res.send(resultPath);
    }));

    router.delete('/', asyncHandler(async (req, res) => {
        const typedReq = req as TypedReq;
        const media = typedReq.query.media as string | undefined;

        if (!media) {
            throw new InvalidQueryParamError('Media not specified');
        }

        await dbTransaction<unknown>(async (db, session) => {
            await db.collection<Report>('reports').updateOne({
                _id: typedReq.report._id
            }, {
                $pull: {
                    media
                }
            }, { session });

            // const filename = path.basename(media);
            // await fileSystemService.removeStored(filename, CONFIG.STORED.PATHS.MEDIA);
        });

        res.json();
    }));

    return router;
}
