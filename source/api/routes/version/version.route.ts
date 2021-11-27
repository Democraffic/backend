import { Router } from 'express';

import CONFIG from '@/config';

export default function (): Router {
    const router = Router();

    router.get('/', (_req, res) => {
        res.json(CONFIG.API_VERSION);
    });

    return router;
}
