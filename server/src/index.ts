import express from 'express';
import { start, stop, status, resource } from './systemd';

const PORT = process.env.PORT || 8080;

const app = express();

const main = async () => {
    const { active, pid } = await status();
    const res = await resource(pid);
    console.log({
        active, pid, res
    });
}

main()
    .then(x => process.exit())
    .catch(e => {
        console.error(e);
        process.exit(1);
    });


// const server = app.listen(PORT, () => {
//     console.log(`server started at localhost:${PORT}`)
// });