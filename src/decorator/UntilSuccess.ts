import { Task } from "../Task";
import { LoopDecorator } from "./LoopDecorator";

/**
 * An UntilSuccess decorator will repeat the wrapped task until that task succeeds,
 * which makes the decorator succeed.
 *
 * Notice that a wrapped task that always fails without entering the running
 * status will cause an infinite loop in the current frame.
 */
export class UntilSuccess<T> extends LoopDecorator<T> {
    public childSuccess(runningTask: Task): void {
        this.success();
        this.loop = false;
    }

    public childFail(runningTask: Task): void {
        this.loop = true;
    }
}