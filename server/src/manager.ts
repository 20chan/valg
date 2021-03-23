import { start, stop, status, resource } from './systemd';

export class ServerManager {
    private pid: number | null;
    private cpu: number | null;
    private mem: number | null;

    private jobStatus: ReturnType<typeof setInterval> | null;
    private jobResource: ReturnType<typeof setInterval> | null;

    private lastStatus: Date | null;
    private lastResource: Date | null;

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
        await this.fetchStatus();
        await this.fetchResource();
        this.startJob();
    }

    public async stop() {
        await stop();
        await this.fetchStatus();
        await this.fetchResource();
        this.stopJob();
    }

    private async fetchStatus() {
        const { active, pid } = await status();
        this.pid = active ? null : pid;
        this.lastStatus = new Date();
    }

    private async fetchResource() {
        if (this.pid) {
            const { status } = await resource(this.pid);
            this.cpu = status?.cpu ?? null;
            this.mem = status?.mem ?? null;
        } else {
            this.cpu = null;
            this.mem = null;
        }
        this.lastResource = new Date();
    }

    private startJob() {
        this.stopJob();
        this.jobStatus = setInterval(this.fetchStatus, 60 * 1000);
        this.jobResource = setInterval(this.fetchResource, 1000);
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