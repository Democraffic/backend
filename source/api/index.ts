import { Router } from 'express';
import logger from '@/utils/logger';

import reportsRouter from './routes/reports/reports.route';
import solutionsRouter from './routes/solutions/solutions.route';
import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/reports');
    router.use('/reports', reportsRouter());

    logger.debug('/solutions');
    router.use('/solutions', solutionsRouter());

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
