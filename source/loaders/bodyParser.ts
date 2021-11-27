import * as express from 'express';
import { Express } from 'express';
import logger from '@/utils/logger';

export default function loadBodyParser(app: Express): void {
    logger.debug('Load bodyParser');
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
}
