import { Decorator } from "../base";
import { Task } from "../Task";

/**
 * An Invert decorator will succeed if the wrapped task fails and
 * will fail if the wrapped task succeeds.
 */
export class Invert<T> extends Decorator<T> {
    public childSuccess(runningTask: Task): void {
        super.childFail(runningTask);
    }

    public childFail(runningTask: Task): void {
        super.childSuccess(runningTask);
    }
}
