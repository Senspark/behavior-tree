import { BranchTask } from "../base";
import { Task } from "../Task";

/**
 * A DynamicGuardSelector is a branch task that executes the first child
 * whose guard is evaluated to true. At every AI cycle, the children's guards
 * are re-evaluated, so if the guard of the running child is evaluated to false,
 * it is cancelled, and the child with the highest priority starts running.
 * The DynamicGuardSelector task finishes when no guard is evaluated to true
 * (thus failing) or when its active child finishes (returning the active child's
 * termination status).
 */
export class DynamicGuardSelector<T> extends BranchTask<T> {
    protected runningChild?: Task;

    public childSuccess(runningTask: Task): void {
        this.runningChild = undefined;
        this.success();
    }

    public childFail(runningTask: Task): void {
        this.runningChild = undefined;
        this.fail();
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        this.runningChild = runningTask;

        // Return a running status when a child says it's running.
        this.running();
    }

    public run(): void {
        let childToRun: Task | undefined;
        for (let i = 0, n = this.children.length; i < n; ++i) {
            const child = this.children[i];
            if (child.checkGuard(this)) {
                childToRun = child;
                break;
            }
        }
        if (this.runningChild !== undefined && this.runningChild !== childToRun) {
            this.runningChild.cancel();
            this.runningChild = undefined;
        }
        if (childToRun === undefined) {
            this.fail();
        } else {
            if (this.runningChild === undefined) {
                this.runningChild = childToRun;
                this.runningChild.setControl(this);
                this.runningChild.start();
            }
            this.runningChild.run();
        }
    }

    public resetTask(): void {
        super.resetTask();
        this.runningChild = undefined;
    }

    public reset(): void {
        super.reset();
        this.runningChild = undefined;
    }
}