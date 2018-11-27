import { Task } from "../Task";
import { LoopDecorator } from "./LoopDecorator";

/**
 * An UntilFail decorator will repeat the wrapped task until that task fails,
 * which makes the decorator succeed.
 *
 * Notice that a wrapped task that always succeeds without entering the running
 * status will cause an infinite loop in the current frame.
 */
export class UntilFail<T> extends LoopDecorator<T> {
    public childSuccess(runningTask: Task): void {
        this.loop = true;
    }

    public childFail(runningTask: Task): void {
        this.success();
        this.loop = false;
    }
}