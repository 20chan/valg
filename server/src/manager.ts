import { start, stop, status, resource } from './systemd';

export class ServerManager {
    private pid: number | null;
    private cpu: number | null;
    private mem: number | null;

    public get active() : boolean {
        return !!this.pid;
    }

    public get status() {
        return {
            pid: this.pid,
            cpu: this.cpu,
            mem: this.mem,
        };
    }

    private async fetchStatus() {
        const { active, pid } = await status();
        this.pid = active ? null : pid;
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
    }
}