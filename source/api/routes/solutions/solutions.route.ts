import { Request, Router } from 'express';
import * as Joi from 'joi';

import { dbQuery, ObjectId } from '@/services/db.service';

import asyncHandler from '@/utils/asyncHandler';
import { validateDbId } from '@/utils/validatorMiddlewares';
import { validateBody } from '@/utils/validate';

import { ReqIdParams, Solution, SolutionStatus } from '@/types';
import { InternalServerError, NotFoundError } from '@/errors';

export default function (): Router {
    const router = Router();

    router.get('/', asyncHandler(async (req, res) => {
        const solutions = await dbQuery<Solution[]>(db => {
            return db.collection<Solution>('solutions').find().toArray();
        });

        res.json(solutions);
    }));

    router.get('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;

        const solution = await dbQuery<Solution | null>(db => {
            return db.collection<Solution>('solutions').findOne({
                _id: id
            });
        });

        if (solution === null) {
            throw new NotFoundError('Solution not found');
        }

        res.json(solution);
    }));

    router.post('/', asyncHandler(async (req, res) => {
        const bodyValidator = Joi.object({
            title: Joi.string().min(1).max(300),
            description: Joi.string().min(1).max(10000),
            reportId: Joi.string().min(1)
        }).required().options({ presence: 'required' });

        const body: Pick<Solution, 'title' | 'description' | 'reportId'> = validateBody(bodyValidator, req.body);

        const id = await dbQuery<ObjectId | undefined>(async db => {
            const queryBody: Solution = {
                ...body,
                authorId: new ObjectId('507f191e810c19729de860ea'),
                createdAt: new Date(),
                lastUpdatedAt: null,
                status: SolutionStatus.PROPOSED,
                badget: null
            };
            const queryResult = await db.collection<Solution>('solutions').insertOne(queryBody);
            return queryResult.insertedId;
        });

        if (!ObjectId) {
            throw new InternalServerError('Error in inserting new solution');
        }

        res.json(id);
    }));

    // router.patch('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
    //     const typedReq = req as Request & ReqIdParams;
    //     const id = typedReq.idParams.id;

    //     const bodyValidator = Joi.object({
    //         title: Joi.string().min(1).max(300),
    //         description: Joi.string().min(1).max(300),
    //         coordinates: Joi.array().items(Joi.object({ latitude: Joi.number(), longitude: Joi.number() })).min(1)
    //     }).required().options({ presence: 'optional' });
    //     const body: Partial<Pick<Solution, 'title' | 'description' | 'coordinates'>> = validateBody(bodyValidator, req.body);

    //     const updated = await dbQuery<boolean>(async db => {
    //         const queryResult = await db.collection<Solution>('Solutions').updateOne({ _id: id }, { $set: body });
    //         return queryResult.matchedCount > 0;
    //     });

    //     if (!updated) {
    //         throw new NotFoundError('Solution not found');
    //     }
        
    //     res.json();
    // }));

    router.delete('/:id', validateDbId('id'), asyncHandler(async (req, res) => {
        const typedReq = req as Request & ReqIdParams;
        const id = typedReq.idParams.id;

        await dbQuery<unknown>(db => {
            return db.collection<Solution>('solutions').deleteOne({
                _id: id
            });
        });

        res.json();
    }));

    return router;
}
