import * as morgan from 'morgan';
import { Express } from 'express';
import logger from '@/utils/logger';

export default function loadMorgan(app: Express): void {
    logger.debug('Load morgan');
    app.use(morgan('dev'));
}
