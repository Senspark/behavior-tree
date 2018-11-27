import { BaseTask } from "../BaseTask";
import { Task } from "../Task";
import { TaskStatus } from "../TaskStatus";

/**
 * A LeafTask is a terminal task of a behavior tree,
 * contains action or condition logic, can not have any child.
 */
export abstract class LeafTask<T> extends BaseTask<T> {
    /**
     * This method contains the update logic of this leaf task.
     * The actual implementation msut return Running, Succeeded or Failed.
     */
    public abstract execute(): TaskStatus;

    public run(): void {
        const status = this.execute();
        if (status === TaskStatus.Succeeded) {
            this.success();
            return;
        }
        if (status === TaskStatus.Failed) {
            this.fail();
            return;
        }
        if (status === TaskStatus.Running) {
            this.running();
            return;
        }
        throw new Error('Invalid status returned by the execute method.');
    }

    public addChild(child: Task): this {
        throw new Error('A leaf task cannot have any child.');
    }

    public getChildCount(): number {
        return 0;
    }

    public getChild(index: number): Task {
        throw new Error(`A leaf task doesn't have any child.`);
    }

    public childSuccess(runningTask: Task): void {
        // No child.
    }

    public childFail(runningTask: Task): void {
        // No child.
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        // No child.
    }
}