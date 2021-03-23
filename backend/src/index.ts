import express from 'express';
import logger from './logger';
import router from './router';

const PORT = process.env.PORT || 8080;

const app = express();

app.use('/valg/api', router);

const server = app.listen(PORT, () => {
    logger.info(`server started at localhost:${PORT}`);
});