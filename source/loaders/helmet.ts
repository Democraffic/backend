import * as helmet from 'helmet';
import { Express } from 'express';
import logger from '@/utils/logger';

export default function loadHelmet(app: Express): void {
    logger.debug('Load morgan');
    app.use(helmet());
}
