import { ErrorRequestHandler } from 'express';
import { ApiError } from '@/errors/ApiError';
import logger from '@/utils/logger';

export default function (): ErrorRequestHandler {
    return (err, _req, res, _next) => {
        logger.error('Server error', err);
        if (!(err instanceof ApiError)) {
            err = new ApiError(500, 'Internal server error');
        }
        res.status(err.code).send(err.getServerResponse());
    };
}
