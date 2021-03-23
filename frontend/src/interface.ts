export interface TriggerResult {
    isSuccess: boolean;
}

export interface Status {
    pid: number | null;
    cpu: number | null;
    mem: number | null;
    lastStatus: Date | null;
    lastResource: Date | null;
}