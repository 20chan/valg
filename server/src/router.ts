import express from 'express';
import { ServerManager } from './manager';

const router = express.Router();
const manager = new ServerManager();

router.get('/status', (req, resp) => {
    resp.json(manager.status);
});

router.post('/start', async (req, resp) => {
    await manager.start();
    resp.json({ isSuccess: true });
});

router.post('/stop', async (req, resp) => {
    await manager.start();
    resp.json({ isSuccess: true });
});

export default router;