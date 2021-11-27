import * as cors from 'cors';
import { Express } from 'express';
import logger from '@/utils/logger';

export default function loadCors(app: Express): void {
    logger.debug('Load cors');
    app.use(cors());
}
