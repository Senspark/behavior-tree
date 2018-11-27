import { LeafTask } from "../base";
import { TaskStatus } from "../TaskStatus";

type ActionTaskStart<T> = (data: T) => void;
type ActionTaskExecute<T> = (data: T) => TaskStatus;

export class ActionTask<T> extends LeafTask<T> {
    private startFn?: ActionTaskStart<T>;
    private executeFn: ActionTaskExecute<T>;

    public constructor(fn: {
        start?: ActionTaskStart<T>,
        execute: ActionTaskExecute<T>,
    }) {
        super();
        this.startFn = fn.start;
        this.executeFn = fn.execute;
    }

    public start(): void {
        super.start();
        const data = this.getObject();
        this.startFn && this.startFn(data);
    }

    public execute(): TaskStatus {
        const data = this.getObject();
        return this.executeFn(data);
    }
}