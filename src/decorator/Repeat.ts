import { Task } from "../Task";
import { LoopDecorator } from "./LoopDecorator";

export class Repeat<T> extends LoopDecorator<T> {
    private times: number;
    private count: number;

    public constructor(times: number = -1 /* Infinity times. */) {
        super();
        this.times = times;
        this.count = 0;
    }

    public start(): void {
        super.start();
        this.count = this.times;
    }

    public condition(): boolean {
        return super.condition() && this.count !== 0;
    }

    public childSuccess(runningTask: Task): void {
        if (this.count > 0) {
            --this.count;
        }
        if (this.count === 0) {
            super.childSuccess(runningTask);
            this.loop = false;
        } else {
            this.loop = true;
        }
    }

    public childFail(runningTask: Task): void {
        // Treat failure as success.
        this.childSuccess(runningTask);
    }

    public reset(): void {
        super.reset();
        this.times = 0;
        this.count = 0;
    }
}