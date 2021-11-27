import { Router } from 'express';

import { dbQuery } from '@/services/db.service';

import asyncHandler from '@/utils/asyncHandler';

export default function (): Router {
    const router = Router();

    router.get('/', asyncHandler(async (req, res) => {
        const reports = await dbQuery(db => {
            return db.collection('reports').find().toArray();
        });

        res.json(reports);
    }));

    return router;
}
