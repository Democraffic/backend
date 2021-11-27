import { Request, Router } from 'express';
import { v4 as uuid } from 'uuid';

import { dbQuery, dbTransaction } from '@/services/db.service';
import fileSystemService from '@/services/filesystem.service';

import asyncHandler from '@/utils/asyncHandler';
import upload from '@/utils/uploader';
import { validateDbId } from '@/utils/validatorMiddlewares';

import { ReqIdParams, Report } from '@/types';
import { InternalServerError, NotFoundError } from '@/errors';

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

        const filename = `${uuid()}.jpg`;
        const tempPath = req.file?.path;
        if (!tempPath) {
            throw new InternalServerError('File upload failed');
        }

        await dbTransaction(async (db, session) => {
            const toPath = filesystemService.getStoredPath(CONFIG.STORED.PATHS.MEDIA);
            await db.collection<Report>('reports').updateOne({ _id: typedReq.report._id }, {
                $push: {
                    media: toPath
                }
            }, { session });
            await fileSystemService.moveToStored(tempPath, filename, CONFIG.STORED.PATHS.MEDIA);
        });

        res.send(filename);
    }));

    // router.delete('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
    //     const typedReq = req as Request & ReqIdParams;
    //     const id = typedReq.idParams.id;

    //     await dbQuery<unknown>(db => {
    //         return db.collection<Report>('reports').deleteOne({
    //             _id: id
    //         });
    //     });

    //     res.json();
    // }));

    return router;
}
