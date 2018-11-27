import { Task } from "../Task";
import { BranchTask } from "./BranchTask";

export abstract class SingleRunningChildBranch<T> extends BranchTask<T> {
    /** The child in the running status or undefined if no child is running. */
    protected runningChild?: Task;

    /** The index of the child currently processed. */
    protected currentChildIndex: number;

    public constructor(...children: Task[]) {
        super(...children);
        this.currentChildIndex = 0;
    }

    public childSuccess(runningTask: Task): void {
        this.runningChild = undefined;
    }

    public childFail(runningTask: Task): void {
        this.runningChild = undefined;
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        this.runningChild = runningTask;

        // Return a running status when a child says it's running.
        this.running();
    }

    public run(): void {
        if (this.runningChild !== undefined) {
            this.runningChild.run();
            return;
        }
        if (this.currentChildIndex < this.children.length) {
            this.runningChild = this.children[this.currentChildIndex];
            this.runningChild.setControl(this);
            this.runningChild.start();
            if (!this.runningChild.checkGuard(this)) {
                this.runningChild.fail();
            } else {
                this.run();
            }
        } else {
            // Should never happen.
            throw new Error('Unknown error.');
        }
    }

    public start(): void {
        super.start();
        this.currentChildIndex = 0;
        this.runningChild = undefined;
    }

    public cancelRunningChildren(startIndex: number): void {
        super.cancelRunningChildren(startIndex);
        this.runningChild = undefined;
    }

    public resetTask(): void {
        super.resetTask();
        this.currentChildIndex = 0;
        this.runningChild = undefined;
    }

    public reset(): void {
        super.reset();
        this.currentChildIndex = 0;
        this.runningChild = undefined;
    }
}