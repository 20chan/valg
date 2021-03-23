import express from 'express';
import logger from './logger';
import { ServerManager } from './manager';

const router = express.Router();
const manager = new ServerManager();

router.get('/status', (req, resp) => {
    resp.json(manager.status);
});

router.post('/start', async (req, resp) => {
    logger.info('triggered start');
    await manager.start();
    logger.info('triggered start:finished');
    resp.json({ isSuccess: true });
});

router.post('/stop', async (req, resp) => {
    logger.info('triggered stop');
    await manager.stop();
    logger.info('triggered stop:finished');
    resp.json({ isSuccess: true });
});

router.post('/fetch', async (req, resp) => {
    logger.info('triggered fetch');
    await manager.fetch(true);
    logger.info('triggered fetch:finished');
    resp.json({ isSuccess: true });
});

export default router;