import { SingleRunningChildBranch } from "../SingleRunningChildBranch";
import { Task } from "../Task";

export class Sequence<T> extends SingleRunningChildBranch<T> {
    public childSuccess(runningTask: Task): void {
        super.childSuccess(runningTask);
        if (++this.currentChildIndex < this.children.length) {
            // Run the next child.
            this.run();
        } else {
            // All children processed, return success status.
            this.success();
        }
    }

    public childFail(runningTask: Task): void {
        super.childFail(runningTask);

        // Return failure status when a child says it failed.
        this.fail();
    }
}