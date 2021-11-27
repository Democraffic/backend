import * as Joi from 'joi';

import logger from '@/utils/logger';
import { InvalidBodyError } from '@/errors';

export function validateBody<ResultType>(schema: Joi.Schema, body: any): ResultType {
    const result = schema.validate(body);

    if (result.error) {
        const description = result.error.message;
        logger.warning('Validation error', description);
        throw new InvalidBodyError(undefined, description);
    }

    return result.value;
}