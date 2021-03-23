import express from 'express';
import router from './router';

const PORT = process.env.PORT || 8080;

const app = express();

app.use('/valg', router);

const server = app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`)
});