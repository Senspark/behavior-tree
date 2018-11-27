import { SingleRunningChildBranch } from "../SingleRunningChildBranch";
import { Task } from "../Task";

/**
 * A Selector is a branch task that runs every children until one of them succeeds.
 * If a child task fails, the selector will start and run the next child task.
 */
export class Selector<T> extends SingleRunningChildBranch<T> {
    public childSuccess(runningTask: Task): void {
        super.childSuccess(runningTask);

        // Return success status when a child says it succeeded.
        this.success();
    }

    public childFail(runningTask: Task): void {
        super.childFail(runningTask);
        if (++this.currentChildIndex < this.children.length) {
            // Run the next child.
            this.run();
        } else {
            // All children processed, return failure status.
            this.fail();
        }
    }
}