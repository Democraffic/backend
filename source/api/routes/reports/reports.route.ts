import { Request, Router } from 'express';

import { dbQuery } from '@/services/db.service';

import asyncHandler from '@/utils/asyncHandler';
import { validateDbId } from '@/utils/validatorMiddlewares';

import { ReqIdParams, Report } from '@/types';
import { NotFoundError } from '@/errors';

export default function (): Router {
    const router = Router();

    router.get('/', asyncHandler(async (req, res) => {
        const reports = await dbQuery<Report[]>(db => {
            return db.collection<Report>('reports').find().toArray();
        });

        res.json(reports);
    }));

    router.get('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;

        const report = await dbQuery<Report | null>(db => {
            return db.collection<Report>('reports').findOne({
                _id: id
            });
        });

        if (report === null) {
            throw new NotFoundError('Report not found');
        }

        res.json(report);
    }));

    return router;
}
