import { Request, Router } from 'express';
import * as Joi from 'joi';

import { dbQuery, ObjectId } from '@/services/db.service';

import asyncHandler from '@/utils/asyncHandler';
import { validateDbId } from '@/utils/validatorMiddlewares';
import { validateBody } from '@/utils/validate';

import { ReqIdParams, Report, ReportStatus } from '@/types';
import { InternalServerError, InvalidQueryParamError, NotFoundError, SpamDetected } from '@/errors';

import mediaRoute from './media/media.route';
import { checkSpam } from '@/utils/checkSpam';

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

    router.post('/', asyncHandler(async (req, res) => {
        const bodyValidator = Joi.object({
            title: Joi.string().min(1).max(300),
            description: Joi.string().min(1).max(10000),
            coordinates: Joi.array().items(Joi.object({ latitude: Joi.number(), longitude: Joi.number() })).min(1)
        }).required().options({ presence: 'required' });

        const body: Pick<Report, 'title' | 'description' | 'coordinates'> = validateBody(bodyValidator, req.body);

        if (await checkSpam(body.description)) {
            throw new SpamDetected(undefined, body.description);
        }

        const id = await dbQuery<ObjectId | undefined>(async db => {
            const queryBody: Report = {
                ...body,
                authorId: new ObjectId('507f191e810c19729de860ea'),
                media: [],
                upvoters: [],
                createdAt: new Date(),
                lastUpdatedAt: null,
                status: ReportStatus.PROPOSED
            };
            const queryResult = await db.collection<Report>('reports').insertOne(queryBody);
            return queryResult.insertedId;
        });

        if (!ObjectId) {
            throw new InternalServerError('Error in inserting new report');
        }

        res.json(id);
    }));

    router.patch('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;

        const bodyValidator = Joi.object({
            title: Joi.string().min(1).max(300),
            description: Joi.string().min(1).max(300),
            coordinates: Joi.array().items(Joi.object({ latitude: Joi.number(), longitude: Joi.number() })).min(1)
        }).required().options({ presence: 'optional' });
        const body: Partial<Pick<Report, 'title' | 'description' | 'coordinates'>> = validateBody(bodyValidator, req.body);

        if (!!body.description && await checkSpam(body.description)) {
            throw new SpamDetected(undefined, body.description);
        }

        const updated = await dbQuery<boolean>(async db => {
            const queryResult = await db.collection<Report>('reports').updateOne({ _id: id }, { $set: body });
            return queryResult.matchedCount > 0;
        });

        if (!updated) {
            throw new NotFoundError('Report not found');
        }

        res.json();
    }));

    router.delete('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;

        await dbQuery<unknown>(db => {
            return db.collection<Report>('reports').deleteOne({
                _id: id
            });
        });

        res.json();
    }));


    router.put('/:id/upvoters', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;
        const uid = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // just for now, ip address
        const action = req.query.action;

        if (action == 'up') {
            await dbQuery<unknown>(db => {
                return db.collection<Report>('reports').updateOne(
                    { _id: id },
                    { $addToSet: { upvoters: uid as any } }
                )
            });
        }
        else if (action == 'down') {
            await dbQuery<unknown>(db => {
                return db.collection<Report>('reports').updateOne(
                    { _id: id },
                    { $pull: { upvoters: { $in: [uid] } as any } }
                )
            });
        }
        else {
            throw new InvalidQueryParamError('Invalid action');
        }

        res.json();
    }));

    router.use('/:id/media', mediaRoute());

    return router;
}
