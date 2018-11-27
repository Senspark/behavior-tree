import { Decorator } from "../base";
import { Task } from "../Task";

/** An AlwaysSucceed decorator will succeed no matter the wrapped task succeeds or fails. */
export class AlwaysSucceed<T> extends Decorator<T> {
    public childFail(runningTask: Task): void {
        this.childSuccess(runningTask);
    }
}
