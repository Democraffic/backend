import { Express, Router } from 'express';

import logger from '@/utils/logger';

import loadMorgan from './morgan';
import loadHelmet from './helmet';
import loadCors from './cors';
import loadBodyParser from './bodyParser';

import getErrorHandler from './errorHandler';

export class Loader {
    private readonly app: Express;
    private readonly router: () => Router;

    constructor(app: Express, router: () => Router) {
        this.app = app;
        this.router = router;
    }

    public loadMiddlewares(): void {
        logger.hr();
        logger.info('Loading middlewares');

        loadMorgan(this.app);
        loadCors(this.app);
        loadHelmet(this.app);
        loadBodyParser(this.app);

        logger.success('Middlewares loaded');
        logger.hr();
    }

    public loadRouter(): void {
        logger.hr();
        logger.info('Handling routes...');

        this.app.use('/api', this.router());

        logger.success('Handled routes');
        logger.hr();
    }

    public loadErrorHandler(): void {
        logger.hr();
        logger.info('Loading error handler');

        this.app.use(getErrorHandler());

        logger.success('Error handler loaded');
        logger.hr();
    }

}
