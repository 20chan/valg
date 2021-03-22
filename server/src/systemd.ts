import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const statusCmd = `systemctl status valheimserver.service --no-page`;
const startCmd = `systemctl start valheimserver.service`;
const stopCmd = `systemctl stop valheimserver.service`;

type ServiceStatus = {
    active: boolean;
    pid: number;
};

type ResourceStatus = {
    status?: {
        cpu: number;
        mem: number;
    };
};

const run = (cmd: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        execAsync(cmd).then(x => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        });
    });
};

export const status = async () => {
    const parsePid = (out: string) => {
        const line = out.split('\n')[9];
        const match = line.match(/└─([0-9]*).*/);
        return match ? parseInt(match[1], 10) : 0;
    };

    return new Promise<ServiceStatus>((resolve, reject) => {
        execAsync(statusCmd).then(x => {
            resolve({
                active: true,
                pid: parsePid(x.stdout),
            });
        }).catch(x => {
            resolve({
                active: false,
                pid: 0,
            });
        });
    });
};

export const start = async () => {
    return await run(startCmd);
};

export const stop = async () => {
    return await run(stopCmd);
};

export const resource = async (pid: number): Promise<ResourceStatus> => {
    const cmd = `ps -p ${pid} -o %cpu,%mem --no-headers`;

    return new Promise<ResourceStatus>((resolve, reject) => {
        execAsync(cmd).then(x => {
            const [cpu, mem] = x.stdout.split(/\s+/).map(x => parseFloat(x));
            resolve({
                status: {
                    cpu,
                    mem,
                },
            });
        }).catch(x => {
            resolve({});
        });
    });
}