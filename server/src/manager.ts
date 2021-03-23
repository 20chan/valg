import logger from './logger';
import { start, stop, status, resource } from './systemd';

export class ServerManager {
    private pid: number | null;
    private cpu: number | null;
    private mem: number | null;

    private jobStatus: ReturnType<typeof setInterval> | null;
    private jobResource: ReturnType<typeof setInterval> | null;

    private lastStatus: Date | null;
    private lastResource: Date | null;

    constructor() {
        this.pid = null;
        this.cpu = null;
        this.mem = null;
        this.jobStatus = null;
        this.jobResource = null;
        this.lastStatus = null;
        this.lastResource = null;
    }

    public get active(): boolean {
        return !!this.pid;
    }

    public get status() {
        return {
            pid: this.pid,
            cpu: this.cpu,
            mem: this.mem,
            lastStatus: this.lastStatus,
            lastResource: this.lastResource,
        };
    }

    public async start() {
        await start();
        await this.fetch(false);
        this.startJob();
    }

    public async stop() {
        await stop();
        await this.fetch(false);
        this.stopJob();
    }

    public async fetch(log: boolean) {
        await this.fetchStatus(log);
        await this.fetchResource(log);
    }

    private async fetchStatus(log: boolean) {
        const { active, pid } = await status();
        if (log) {
            logger.verbose('fetch status', { active, pid });
        }
        this.pid = active ? pid : null;
        this.lastStatus = new Date();
    }

    private async fetchResource(log: boolean) {
        if (this.pid) {
            const { status } = await resource(this.pid);
            this.cpu = status?.cpu ?? null;
            this.mem = status?.mem ?? null;
        } else {
            this.cpu = null;
            this.mem = null;
        }
        if (log) {
            logger.verbose('fetch resource', {
                pid: this.pid,
                cpu: this.cpu,
                mem: this.mem,
            });
        }
        this.lastResource = new Date();
    }

    private startJob() {
        this.stopJob();
        this.jobStatus = setInterval(() => this.fetchStatus(false), 60 * 1000);
        this.jobResource = setInterval(() => this.fetchResource(false), 1000);
    }

    private stopJob() {
        if (this.jobStatus !== null) {
            clearInterval(this.jobStatus);
            this.jobStatus = null;
        }
        if (this.jobResource !== null) {
            clearInterval(this.jobResource);
            this.jobResource = null;
        }
    }
}