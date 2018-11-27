import { LeafTask } from "../base";
import { TimeData } from "../data";
import { TaskStatus } from "../TaskStatus";

/** Wait is a leaf that keeps running for the specified amount of time then succeeds. */
export class Wait<T extends TimeData> extends LeafTask<T> {
    private seconds: number;
    private elapsed: number;

    public constructor(seconds: number) {
        super();
        this.seconds = seconds;
        this.elapsed = 0;
    }

    public start(): void {
        super.start();
        this.elapsed = 0;
    }

    public execute(): TaskStatus {
        this.elapsed += this.getObject().delta;
        if (this.elapsed >= this.seconds) {
            return TaskStatus.Succeeded;
        } else {
            return TaskStatus.Running;
        }
    }

    public reset(): void {
        super.reset();
        this.seconds = 0;
        this.elapsed = 0;
    }
}