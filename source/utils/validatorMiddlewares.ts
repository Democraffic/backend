import { Request, Response, NextFunction, RequestHandler } from 'express';

import { dbId } from '@/services/db.service';
import { InvalidIdError } from '@/errors';
import { ReqIdParams } from '@/types';

export function validateDbId(params: string | string[], message: string = 'Invalid id parameter'): RequestHandler {
    if (typeof params === 'string') {
        params = [params];
    }

    return (req: Request, _res: Response, next: NextFunction) => {
        const typedReq = req as Request & ReqIdParams;
        typedReq.idParams = {};
        for (const param of params) {
            const paramValue = typedReq.params[param];
            try {
                typedReq.idParams[param] = dbId(paramValue);
            }
            catch (error) {
                throw new InvalidIdError(undefined, {
                    param: {
                        name: param,
                        value: paramValue
                    }
                });
            }
        }
        next();
    };
}